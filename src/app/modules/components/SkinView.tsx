import { CSSProperties, JSX, useEffect, useRef } from 'react';
import { PlayerAnimation, PlayerObject, SkinViewer, WalkingAnimation } from 'skinview3d';

interface SkinView3DOptions {
    SKIN: string;
    CAPE: string;
    className: string;
    style?: CSSProperties;
    slim: boolean;
    id: string;
    width?: number;
    height?: number;
    pose?: number;
    background?: string;
}

export class TPose extends PlayerAnimation {
    protected animate(player: PlayerObject): void {
        const t = this.progress * 2;
        const PI = Math.PI;
        const default_arm_rot = (PI / 180) * -89;
        player.skin.rightArm.rotation.z = Math.cos(t) * 0.02 + default_arm_rot;
        player.skin.leftArm.rotation.z = Math.cos(t - PI) * 0.02 - default_arm_rot;

        player.skin.leftLeg.rotation.z = (PI / 180) * 25;
        player.skin.rightLeg.rotation.z = (PI / 180) * -25;
    }
}

const SkinView3D = ({
    SKIN,
    CAPE,
    className,
    slim,
    id,
    width,
    height,
    pose,
    background,
    style
}: SkinView3DOptions): JSX.Element => {
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const skinViewRef = useRef<SkinViewer>(null);

    const setPose = (pose: number) => {
        switch (pose) {
            case 0:
                skinViewRef.current.animation = null;
                break;
            case 1:
                skinViewRef.current.animation = new WalkingAnimation();
                skinViewRef.current.animation.speed = 0.65;
                break;
            case 2:
                skinViewRef.current.animation = new TPose();
                break;
        }
    };

    useEffect(() => {
        const view = new SkinViewer({
            canvas: canvasRef.current,
            width: width || 400,
            height: height || 400
        });
        skinViewRef.current = view;

        setPose(pose);
        skinViewRef.current.controls.enablePan = true;
        skinViewRef.current.fov = 90;
        skinViewRef.current.globalLight.intensity = 2.5;
        skinViewRef.current.camera.zoom = 0.9;

        skinViewRef.current.camera.rotation.x = -0.36;
        skinViewRef.current.camera.rotation.y = 0.73;
        skinViewRef.current.camera.rotation.z = 0.24;
        skinViewRef.current.camera.position.x = 14.6;
        skinViewRef.current.camera.position.y = 7;
        skinViewRef.current.camera.position.z = 15;

        skinViewRef.current.scene.position.y = -2.5;
        background && skinViewRef.current.loadBackground(background);

        skinViewRef.current.loadSkin(SKIN ? SKIN : '/static/workshop_base.png', { model: slim ? 'slim' : 'default' });
        CAPE && skinViewRef.current.loadSkin(CAPE);

        const resizeObserver = new ResizeObserver((entries) => {
            const { width, height } = entries[0].contentRect;
            if (!skinViewRef.current) return;
            skinViewRef.current.width = width;
            skinViewRef.current.height = height;
        });

        resizeObserver.observe(document.getElementById(id) as HTMLDivElement);
    }, []);

    useEffect(() => {
        skinViewRef.current?.loadSkin(SKIN ? SKIN : '/static/workshop_base.png', { model: slim ? 'slim' : 'default' });
    }, [SKIN, slim]);

    useEffect(() => {
        CAPE ? skinViewRef.current?.loadCape(CAPE) : skinViewRef.current?.resetCape();
    }, [CAPE]);

    useEffect(() => {
        setPose(pose);
    }, [pose]);

    return (
        <div id={id} className={className} style={style}>
            <canvas ref={canvasRef} />
        </div>
    );
};

export default SkinView3D;
