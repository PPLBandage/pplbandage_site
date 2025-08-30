import { CSSProperties, JSX, useEffect, useRef, useState } from 'react';
import { SkinViewer } from 'skinview3d';
import styles from '@/styles/root/page.module.css';

import animation from '@/resources/model.animation.json';
import { AnimationController } from './AnimationController';
import axios from 'axios';
import { b64Prefix } from '@/lib/bandageEngine';
import { minecraftMono } from '@/fonts/Minecraft';
import { ModelType } from 'skinview-utils';

interface SkinView3DOptions {
    style?: CSSProperties;
    width?: number;
    height?: number;
}

interface InitialReturningData {
    start_pos: number;
    start_time: number;
    running: boolean;
    grabbed: boolean;
}

interface HitRef {
    type: string;
    x: number;
    y: number;
}

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
    const [nickname, setNickname] = useState<string>('empty');
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
                skinViewRef.current?.dispose?.();
                setInited(false);
                cancelAnimationFrame(rafRef.current);
            } else if (!skinViewRef.current || skinViewRef.current.disposed) {
                initSkinViewer();
            }
        };
        checkMobile();
        window.addEventListener('resize', checkMobile);

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
        skinViewRef.current.camera.fov = 70;

        // Советую не менять эти параметры
        // Они подобраны с участием тарологов (зефирки)
        skinViewRef.current.camera.position.x = 16.6;
        skinViewRef.current.camera.position.y = 20.65;
        skinViewRef.current.camera.position.z = 40.02;

        skinViewRef.current.scene.position.x = 0.3;
        skinViewRef.current.scene.position.y = -1.5;

        skinViewRef.current.cameraLight.intensity = 1400;
        skinViewRef.current.globalLight.intensity = 1.9;

        // Да, чуваки, это асинхронный IIFE
        // Просто потому что я могу
        (async () => {
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

            await skinViewRef.current.loadSkin(b64, { model: type });
        })().then(() => {
            animationRef.current = new AnimationController({
                animation,
                animationName: 'initial',
                connectCape: true
            });
            skinViewRef.current.animation = animationRef.current;

            setInited(true);
        });

        const checkLastGrabbed = () => {
            if (initialReturningData.current.grabbed) {
                lastTimeGrabbed.current = Date.now();
            }

            if (initialReturningData.current.running) {
                const st = initialReturningData.current.start_time;
                const et = initialReturningData.current.start_time + 500;
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

        let y: number;
        let mouse_x: number;
        let mouse_y: number;
        const rect = canvasRef.current.getBoundingClientRect();
        if ('touches' in evt) {
            if (evt.touches.length === 0) return;
            y = evt.touches[0].clientY - rect.top;
            mouse_x = evt.touches[0].clientX;
            mouse_y = evt.touches[0].clientY;
        } else {
            y = evt.clientY - rect.top;
            mouse_x = evt.clientX;
            mouse_y = evt.clientY;
        }

        hitTypeRef.current = {
            type: y < 260 * (rect.height / (height ?? 400)) ? 'head' : 'body',
            x: mouse_x,
            y: mouse_y
        };
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
                <span className={styles.nickname} style={minecraftMono.style}>
                    {nickname}
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
