import { JSX, useEffect, useRef, useState } from 'react';
import { SkinViewer } from 'skinview3d';
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';
import styles from '@/styles/root/page.module.css';

import animation from '@/resources/model.animation.json';
import { AnimationController } from '@/lib/root/AnimationController';
import axios from 'axios';
import { b64Prefix } from '@/lib/bandageEngine';
import { minecraftMono } from '@/fonts/Minecraft';
import { ModelType } from 'skinview-utils';
import { getCurrentEvent } from '@/lib/root/events';
import { degToRad } from 'three/src/math/MathUtils.js';
import { Object3D, Plane, Raycaster, Vector2, Vector3 } from 'three';
import { getCssGradientString } from '@/lib/root/names_gradients';

function easeInOutSine(x: number): number {
    return -(Math.cos(Math.PI * x) - 1) / 2;
}

function normalizeAngle(angle: number) {
    let a = angle % (2 * Math.PI);
    if (a <= -Math.PI) a += 2 * Math.PI;
    else if (a > Math.PI) a -= 2 * Math.PI;
    return a;
}

const SkinRender = ({ width, height }: SkinView3DOptions): JSX.Element => {
    const [nickname, setNickname] = useState<string>('Unknown');
    const [grabbed, setGrabbed] = useState<boolean>(false);
    const [inited, setInited] = useState<boolean>(false);

    const initialReturningData = useRef<InitialReturningData>({
        start_pos: 0,
        start_time: 0,
        running: false,
        grabbed: false
    });
    const animationRef = useRef<AnimationController>(null!);
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const hitTypeRef = useRef<HitRef | null>(null);
    const skinViewRef = useRef<SkinViewer>(null!);
    const lastTimeGrabbed = useRef<number>(0);
    const posRef = useRef<number | null>(0);
    const rafRef = useRef<number>(0);

    useEffect(() => {
        const checkMobile = () => {
            if (window.innerWidth <= 850) {
                if (skinViewRef.current?.disposed) return;
                skinViewRef.current?.dispose?.();
                setInited(false);
                cancelAnimationFrame(rafRef.current);
            } else if (!skinViewRef.current || skinViewRef.current.disposed) {
                initSkinViewer();
            }
        };
        checkMobile();
        window.addEventListener('resize', checkMobile);

        /*
        setInterval(() => {
            console.log(
                skinViewRef.current.camera.position,
                skinViewRef.current.controls.target
            );
        }, 150);
        */

        return () => {
            if (skinViewRef.current) skinViewRef.current.dispose();
            cancelAnimationFrame(rafRef.current);
            window.removeEventListener('resize', checkMobile);
        };
    }, []);

    const initSkinViewer = () => {
        setInited(false);
        skinViewRef.current = new SkinViewer({
            canvas: canvasRef.current!,
            width: width || 400,
            height: height || 400
        });

        skinViewRef.current.controls.enabled = false;
        //skinViewRef.current.controls.enablePan = true;
        skinViewRef.current.camera.fov = 70;

        // Советую не менять эти параметры
        // Они подобраны с участием тарологов
        skinViewRef.current.camera.position.set(24.55, 20.85, 57.84);
        skinViewRef.current.controls.target.set(-0.69, 3.91, -3.61);

        skinViewRef.current.scene.position.x = 0.8;
        skinViewRef.current.scene.position.y = -1.5;

        skinViewRef.current.cameraLight.intensity = 1400;
        skinViewRef.current.globalLight.intensity = 2.2;

        // Отсечение модели ниже земли
        const clipPlane = new Plane(new Vector3(0, 1, 0), 17.5);
        skinViewRef.current.renderer.clippingPlanes = [clipPlane];
        skinViewRef.current.renderer.localClippingEnabled = true;

        const loadData = async () => {
            // Загрузить текущее событие и шапку для него
            const event = getCurrentEvent();
            if (event) {
                const gltf = await new GLTFLoader().loadAsync(event.gltf);
                const hat = gltf.scene;

                type ParamsArr = [number, number, number];
                hat.scale.set(...(event.scale as ParamsArr));
                hat.position.set(...(event.position as ParamsArr));
                hat.rotation.set(...(event.rotation.map(degToRad) as ParamsArr));

                const bodyPart = skinViewRef.current.playerObject.skin[
                    event.body_part as keyof typeof skinViewRef.current.playerObject.skin
                ] as Object3D;
                bodyPart.add(hat);
            }

            const res = await axios.get('/api/v1/minecraft/main-page-skin', {
                responseType: 'arraybuffer',
                validateStatus: () => true
            });

            let b64: string;
            let type: ModelType | 'auto-detect' = 'auto-detect';
            if (res.status === 200) {
                b64 = b64Prefix + Buffer.from(res.data).toString('base64');
                setNickname(decodeURIComponent(res.headers['x-name']));
                switch (res.headers['x-slim']) {
                    case 'true':
                        type = 'slim';
                        break;
                    case 'false':
                        type = 'default';
                        break;
                }
            } else {
                b64 = '/static/workshop_base.png';
            }

            await skinViewRef.current.loadSkin(b64, {
                model: type
            });

            animationRef.current = new AnimationController({
                animation,
                animationName:
                    event?.name === 'halloween' ? 'initial_halloween' : 'initial',
                connectCape: true
            });
            skinViewRef.current.animation = animationRef.current;

            setInited(true);
        };

        void loadData();

        const checkLastGrabbed = () => {
            if (initialReturningData.current.grabbed) {
                lastTimeGrabbed.current = Date.now();
            }

            if (initialReturningData.current.running) {
                const st = initialReturningData.current.start_time;
                const et = st + 500;
                const progress = (Date.now() - st) / (et - st);

                if (progress >= 1) {
                    initialReturningData.current.running = false;
                }

                skinViewRef.current.playerWrapper.rotation.y =
                    initialReturningData.current.start_pos *
                    easeInOutSine(1 - progress);
            }

            if (
                Date.now() - lastTimeGrabbed.current >= 2000 &&
                !initialReturningData.current.running &&
                !initialReturningData.current.grabbed &&
                skinViewRef.current.playerWrapper.rotation.y !== 0
            ) {
                initialReturningData.current.running = true;
                initialReturningData.current.start_pos = normalizeAngle(
                    skinViewRef.current.playerWrapper.rotation.y
                );
                initialReturningData.current.start_time = Date.now();
            }
            rafRef.current = requestAnimationFrame(checkLastGrabbed);
        };

        requestAnimationFrame(checkLastGrabbed);
    };

    useEffect(() => {
        const onMouseMove = (evt: MouseEvent | TouchEvent) => {
            if (!grabbed || !canvasRef.current) return;

            const rect = canvasRef.current.getBoundingClientRect();
            let x: number;
            let mouse_x: number;
            let mouse_y: number;

            if ('touches' in evt) {
                if (evt.touches.length === 0) return;
                x = evt.touches[0].clientX - rect.left;
                mouse_x = evt.touches[0].clientX;
                mouse_y = evt.touches[0].clientY;
            } else {
                x = evt.clientX - rect.left;
                mouse_x = evt.clientX;
                mouse_y = evt.clientY;
            }

            if (!posRef.current) posRef.current = x;
            skinViewRef.current.playerWrapper.rotation.y +=
                (x - posRef.current) / 100;

            posRef.current = x;

            if (hitTypeRef.current) {
                // Create mouse move window (20x20px), when hit is still counted
                if (
                    Math.abs(mouse_x - hitTypeRef.current.x) >= 10 ||
                    Math.abs(mouse_y - hitTypeRef.current.y) >= 10
                ) {
                    hitTypeRef.current = null;
                }
            }
        };

        const onMouseUp = () => {
            setGrabbed(false);
            posRef.current = null;
            if (hitTypeRef.current) {
                animationRef.current.handleClick(hitTypeRef.current.type);
                hitTypeRef.current = null;
            }
        };

        window.addEventListener('mousemove', onMouseMove);
        window.addEventListener('mouseup', onMouseUp);

        window.addEventListener('touchmove', onMouseMove);
        window.addEventListener('touchend', onMouseUp);

        initialReturningData.current.grabbed = grabbed;
        if (grabbed) initialReturningData.current.running = false;

        return () => {
            window.removeEventListener('mousemove', onMouseMove);
            window.removeEventListener('mouseup', onMouseUp);

            window.removeEventListener('touchmove', onMouseMove);
            window.removeEventListener('touchend', onMouseUp);
        };
    }, [grabbed]);

    const handleClick = (
        evt:
            | React.MouseEvent<HTMLCanvasElement, MouseEvent>
            | React.TouchEvent<HTMLCanvasElement>
    ) => {
        if (!canvasRef.current) return;

        let x: number;
        let y: number;
        let mouse_x: number;
        let mouse_y: number;
        const rect = canvasRef.current.getBoundingClientRect();
        if ('touches' in evt) {
            if (evt.touches.length === 0) return;
            x = evt.touches[0].clientX - rect.left;
            y = evt.touches[0].clientY - rect.top;
            mouse_x = evt.touches[0].clientX;
            mouse_y = evt.touches[0].clientY;
        } else {
            x = evt.clientX - rect.left;
            y = evt.clientY - rect.top;
            mouse_x = evt.clientX;
            mouse_y = evt.clientY;
        }

        const ndcX = (x / rect.width) * 2 - 1;
        const ndcY = -(y / rect.height) * 2 + 1;
        const body_parts_names = [
            'head',
            'body',
            'leftArm',
            'rightArm',
            'leftLeg',
            'rightLeg'
        ];

        const raycaster = new Raycaster();
        raycaster.setFromCamera(new Vector2(ndcX, ndcY), skinViewRef.current.camera);
        const intersects = raycaster.intersectObjects(
            skinViewRef.current.scene.children
        );

        if (intersects.length !== 0) {
            const intersected = intersects[0].object;

            const recursive_find = (obj: Object3D, f_list: string[]) => {
                if (f_list.includes(obj.name)) return obj.name;
                if (!obj.parent) return null;
                return recursive_find(obj.parent, f_list);
            };

            const intersected_name = recursive_find(intersected, body_parts_names);
            const hit_type = intersected_name === 'head' ? 'head' : 'body';

            hitTypeRef.current = {
                type: hit_type,
                x: mouse_x,
                y: mouse_y
            };
        }
        setGrabbed(true);
    };

    return (
        <div
            className={styles.image_container}
            style={{
                cursor: grabbed ? 'grabbing' : 'grab',
                opacity: inited ? '1' : '0'
            }}
        >
            <div className={styles.nickname_container}>
                <span className={styles.nickname}>
                    <span
                        className={styles.nickname_gradient}
                        style={{
                            ...minecraftMono.style,
                            background: getCssGradientString(nickname)
                        }}
                    >
                        {nickname}
                    </span>
                </span>
            </div>
            <canvas
                width={width}
                height={height}
                ref={canvasRef}
                className={styles.skin_render}
                onMouseDown={handleClick}
                onTouchStart={handleClick}
            />
            <svg
                width="250"
                height="120"
                xmlns="http://www.w3.org/2000/svg"
                className={styles.shadow}
            >
                <ellipse rx="125" ry="60" cx="125" cy="60" />
            </svg>
        </div>
    );
};

export default SkinRender;
