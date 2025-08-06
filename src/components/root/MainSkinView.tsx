import { CSSProperties, JSX, useEffect, useRef, useState } from 'react';
import { PlayerAnimation, PlayerObject, SkinViewer } from 'skinview3d';
import { SkinViewBlockbench } from 'skinview3d-blockbench';
import { Euler, MathUtils } from 'three';

import animation from './model.animation.json';
import skin from './skin.png';

interface SkinView3DOptions {
    SKIN?: string;
    style?: CSSProperties;
    width?: number;
    height?: number;
}

export class Pose extends PlayerAnimation {
    private getEuler(x: number, y: number, z: number) {
        return new Euler(
            MathUtils.degToRad(x),
            -MathUtils.degToRad(y),
            -MathUtils.degToRad(z),
            'ZYX'
        );
    }

    protected animate(player: PlayerObject): void {
        player.skin.head.setRotationFromEuler(this.getEuler(-5, -9.9, 0.2));
        player.skin.leftArm.setRotationFromEuler(this.getEuler(0, 0, -10));
        player.skin.rightArm.setRotationFromEuler(this.getEuler(0, 0, 7.5));
        player.skin.leftLeg.setRotationFromEuler(this.getEuler(0, 2.5, -7.5));
        player.skin.rightLeg.setRotationFromEuler(this.getEuler(0, 0, 5));
    }
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
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const skinViewRef = useRef<SkinViewer>(null);
    const posRef = useRef<number>(0);
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
            const isMobile = window.innerWidth <= 850;
            if (isMobile) {
                skinViewRef.current?.dispose?.();
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
        const view = new SkinViewer({
            canvas: canvasRef.current,
            skin: SKIN ? SKIN : skin,
            width: width || 400,
            height: height || 400
        });
        skinViewRef.current = view;

        skinViewRef.current.controls.enableZoom = false;
        skinViewRef.current.controls.enableRotate = false;
        skinViewRef.current.controls.enablePan = false;

        skinViewRef.current.camera.fov = 70;
        //skinViewRef.current.globalLight.intensity = 2.5;

        skinViewRef.current.camera.position.x = 15.69;
        skinViewRef.current.camera.position.y = 18.09;
        skinViewRef.current.camera.position.z = 32.03;

        skinViewRef.current.scene.position.x = 0.3;
        skinViewRef.current.scene.position.y = -1.5;

        skinViewRef.current.animation = new SkinViewBlockbench({
            animation,
            animationName: '1_anim'
        });

        const checkLastGrabbed = () => {
            if (initialReturningData.current.running) {
                const st = initialReturningData.current.start_time;
                const et = initialReturningData.current.start_time + 500;

                const progress = (new Date().getTime() - st) / (et - st);

                if (progress >= 1) {
                    initialReturningData.current.running = false;
                }

                skinViewRef.current.playerWrapper.rotation.y =
                    initialReturningData.current.start_pos *
                    easeInOutSine(1 - progress);
            }

            if (
                new Date().getTime() - lastTimeGrabbed.current >= 2000 &&
                !initialReturningData.current.running &&
                skinViewRef.current.playerWrapper.rotation.y !== 0 &&
                !initialReturningData.current.grabbed
            ) {
                initialReturningData.current.running = true;
                initialReturningData.current.start_pos = normalizeAngle(
                    skinViewRef.current.playerWrapper.rotation.y % (Math.PI * 2)
                );
                initialReturningData.current.start_time = new Date().getTime();
            }
            intervalRef.current = requestAnimationFrame(checkLastGrabbed);
        };

        intervalRef.current = requestAnimationFrame(checkLastGrabbed);
    };

    useEffect(() => {
        const onMouseMove = (evt: MouseEvent) => {
            if (!grabbed || !canvasRef.current) return;
            const rect = canvasRef.current.getBoundingClientRect();
            const x = evt.clientX - rect.left;

            if (!posRef.current) posRef.current = x;

            skinViewRef.current.playerWrapper.rotation.y +=
                (x - posRef.current) / 100;

            posRef.current = x;
            lastTimeGrabbed.current = new Date().getTime();
        };

        const onMouseUp = () => {
            setGrabbed(false);
            posRef.current = null;
        };

        window.addEventListener('mousemove', onMouseMove);
        window.addEventListener('mouseup', onMouseUp);

        initialReturningData.current.grabbed = grabbed;
        if (grabbed) initialReturningData.current.running = false;

        return () => {
            window.removeEventListener('mousemove', onMouseMove);
            window.removeEventListener('mouseup', onMouseUp);
        };
    }, [grabbed]);

    return (
        <canvas
            width={width}
            height={height}
            ref={canvasRef}
            style={{
                position: 'relative',
                zIndex: 5,
                cursor: grabbed ? 'grabbing' : 'grab'
            }}
            onMouseDown={() => setGrabbed(true)}
            onMouseUp={() => setGrabbed(false)}
        />
    );
};

export default SkinRender;
