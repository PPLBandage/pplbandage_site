import { LegacyRef, useEffect, useRef } from 'react';
import { SkinViewer, WalkingAnimation } from 'skinview3d';


interface SkinView3DOptions {
    SKIN: string,
    CAPE: string,
    PANORAMA: string,
    className: string,
    slim: boolean
}

const SkinView3D = ({SKIN, CAPE, PANORAMA, className, slim}: SkinView3DOptions): JSX.Element => {
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
            skinViewRef.current.width = width;
            skinViewRef.current.height = document.body.clientWidth > 767 ? height : width;
        });
    
        resizeObserver.observe(document.getElementById("canvas_container") as HTMLDivElement);
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

    return <canvas className={className} ref={canvasRef as LegacyRef<HTMLCanvasElement> | undefined} />;
}

export default SkinView3D;