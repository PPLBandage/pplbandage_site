import { LegacyRef, useEffect, useRef } from 'react';
import { PlayerAnimation, PlayerObject, SkinViewer, WalkingAnimation } from 'skinview3d';


interface SkinView3DOptions {
    SKIN: string,
    CAPE: string,
    PANORAMA: string,
    className: string,
    slim: boolean,
    id: string
}

export class TestAnim extends PlayerAnimation {
    protected animate(player: PlayerObject): void {
        //const t = this.progress * 2;
        const PI = Math.PI;
        player.skin.rightArm.rotation.z = (PI / 180) * -90;
        player.skin.leftArm.rotation.z = (PI / 180) * 90;
    }
}


const SkinView3D = ({SKIN, CAPE, PANORAMA, className, slim, id}: SkinView3DOptions): JSX.Element => {
    const canvasRef = useRef<HTMLCanvasElement>();
    const skinViewRef = useRef<SkinViewer>();

    useEffect(() => {
        const view = new SkinViewer({
            canvas: canvasRef.current,
            width: 300,
            height: 300
        });
        skinViewRef.current = view;
        
        skinViewRef.current.animation = new WalkingAnimation();
		skinViewRef.current.controls.enablePan = true;
		skinViewRef.current.fov = 90;
		skinViewRef.current.animation.speed = 0.65;
		skinViewRef.current.camera.position.x = 20;
		skinViewRef.current.camera.position.y = 15;
		skinViewRef.current.globalLight.intensity = 2.5;

        skinViewRef.current.loadSkin(SKIN ? SKIN : "./static/steve.png", { model: slim ? "slim" : "default" });
        CAPE && skinViewRef.current.loadSkin(CAPE);
        PANORAMA && skinViewRef.current?.loadPanorama(PANORAMA);

        const resizeObserver = new ResizeObserver(entries => {
            const { width, height } = entries[0].contentRect;
            if (!skinViewRef.current) return;
            skinViewRef.current.width = width + 0.1;
            skinViewRef.current.height = (document.body.clientWidth > 767 ? height : width) + 0.1;
        });
    
        resizeObserver.observe(document.getElementById(id) as HTMLDivElement);
    }, [])

    useEffect(() => {
        skinViewRef.current?.loadSkin(SKIN ? SKIN : "./static/steve.png", { model: slim ? "slim" : "default" });
    }, [SKIN]);

    useEffect(() => {
        CAPE ? skinViewRef.current?.loadCape(CAPE) : skinViewRef.current?.resetCape();
    }, [CAPE]);

    useEffect(() => {
        PANORAMA && skinViewRef.current?.loadPanorama(PANORAMA);
    }, [PANORAMA]);

    useEffect(() => {
        skinViewRef.current?.loadSkin(SKIN ? SKIN : "./static/steve.png", { model: slim ? "slim" : "default" });
    }, [slim]);

    return (<div className={className} id={id}>
                <canvas ref={canvasRef as LegacyRef<HTMLCanvasElement> | undefined} />
            </div>);
}

export default SkinView3D;