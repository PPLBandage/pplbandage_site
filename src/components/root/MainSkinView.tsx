import { CSSProperties, JSX, useEffect, useRef, useState } from 'react';
import { SkinViewer } from 'skinview3d';
import styles from '@/styles/root/page.module.css';

import animation from '@/resources/1model.animation.json';
import skin from '@/resources/skin.png';
import { AnimationController } from './AnimationController';

interface SkinView3DOptions {
    SKIN?: string;
    style?: CSSProperties;
    width?: number;
    height?: number;
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

const SkinRender = ({ SKIN, width, height }: SkinView3DOptions): JSX.Element => {
    const [inited, setInited] = useState<boolean>(false);
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const skinViewRef = useRef<SkinViewer>(null!);
    const posRef = useRef<number | null>(0);
    const intervalRef = useRef<number>(0);
    const [grabbed, setGrabbed] = useState<boolean>(false);

    const lastTimeGrabbed = useRef<number>(0);
    const initialReturningData = useRef<{
        start_pos: number;
        start_time: number;
        running: boolean;
        grabbed: boolean;
    }>({
        start_pos: 0,
        start_time: 0,
        running: false,
        grabbed: false
    });

    useEffect(() => {
        const checkMobile = () => {
            if (window.innerWidth <= 850) {
                skinViewRef.current?.dispose?.();
                setInited(false);
                cancelAnimationFrame(intervalRef.current);
            } else if (!skinViewRef.current || skinViewRef.current.disposed) {
                initSkinViewer();
            }
        };
        checkMobile();
        window.addEventListener('resize', checkMobile);

        return () => {
            if (skinViewRef.current) skinViewRef.current.dispose();
            cancelAnimationFrame(intervalRef.current);
            window.removeEventListener('resize', checkMobile);
        };
    }, []);

    const initSkinViewer = () => {
        skinViewRef.current = new SkinViewer({
            canvas: canvasRef.current!,
            width: width || 400,
            height: height || 400
        });

        skinViewRef.current.controls.enableZoom = false;
        skinViewRef.current.controls.enableRotate = false;
        skinViewRef.current.controls.enablePan = false;

        skinViewRef.current.camera.fov = 70;

        skinViewRef.current.camera.position.x = 15.69;
        skinViewRef.current.camera.position.y = 18.09;
        skinViewRef.current.camera.position.z = 32.03;

        skinViewRef.current.scene.position.x = 0.3;
        skinViewRef.current.scene.position.y = -1.5;

        skinViewRef.current.animation = new AnimationController({
            animation,
            animationName: 'initial'
        });

        skinViewRef.current.loadSkin(SKIN ? SKIN : skin).then(() => setInited(true));

        const checkLastGrabbed = () => {
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
            intervalRef.current = requestAnimationFrame(checkLastGrabbed);
        };

        requestAnimationFrame(checkLastGrabbed);
    };

    useEffect(() => {
        const onMouseMove = (evt: MouseEvent | TouchEvent) => {
            if (!grabbed || !canvasRef.current) return;

            const rect = canvasRef.current.getBoundingClientRect();
            let x: number;

            if (evt instanceof TouchEvent) {
                if (evt.touches.length === 0) return;
                x = evt.touches[0].clientX - rect.left;
            } else {
                x = evt.clientX - rect.left;
            }

            if (!posRef.current) posRef.current = x;

            skinViewRef.current.playerWrapper.rotation.y +=
                (x - posRef.current) / 100;

            posRef.current = x;
            lastTimeGrabbed.current = Date.now();
        };

        const onMouseUp = () => {
            setGrabbed(false);
            posRef.current = null;
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

    return (
        <div
            className={styles.image_container}
            style={{
                cursor: grabbed ? 'grabbing' : 'grab',
                opacity: inited ? '1' : '0'
            }}
        >
            <canvas
                width={width}
                height={height}
                ref={canvasRef}
                className={styles.skin_render}
                onMouseDown={() => setGrabbed(true)}
                onTouchStart={() => setGrabbed(true)}
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
