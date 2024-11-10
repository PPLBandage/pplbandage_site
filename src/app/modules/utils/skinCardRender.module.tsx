import { Bandage } from "@/app/interfaces";
import { Card } from "../components/card.module";
import { SkinViewer } from "skinview3d";
import asyncImage from "@/app/modules/components/asyncImage.module";
import { fillPepe } from "@/app/workshop/[id]/bandage_engine.module";

const b64Prefix = "data:image/png;base64,";

const randint = (min: number, max: number): number => {
    return Math.random() * (max - min) + min;
}

export const generateSkin = async (b64: string, base_skin: HTMLImageElement, colorable: boolean): Promise<string> => {
    const bandage = await asyncImage(b64Prefix + b64);

    const height = Math.floor(bandage.height / 2);
    const position = 6 - Math.ceil(height / 2);

    const skin_canvas = document.createElement('canvas');
    const skin_context = skin_canvas.getContext('2d');
    skin_canvas.width = 64;
    skin_canvas.height = 64;

    const bandage_new = colorable ? fillPepe(bandage, [randint(0, 255), randint(0, 255), randint(0, 255)]) : bandage;
    skin_context.drawImage(base_skin, 0, 0);
    skin_context.drawImage(bandage_new, 0, 0, 16, height, 48, 52 + position, 16, height);
    skin_context.drawImage(bandage_new, 0, height, 16, height, 32, 52 + position, 16, height);

    return skin_canvas.toDataURL();
};

export const render = (
    skinViewer: SkinViewer,
    data: Bandage[],
    styles: { readonly [key: string]: string; },
    base_skin: HTMLImageElement
): Promise<JSX.Element[]> => {
    return Promise.all(data.map(async el => {
        try {
            const result = await generateSkin(el.base64, base_skin, el.categories.some(val => val.colorable));
            await skinViewer.loadSkin(result, { model: 'default' });
            skinViewer.render();
            return (
                <Card
                    el={el}
                    base64={skinViewer.canvas.toDataURL()}
                    key={el.id}
                    className={styles}
                />
            );
        } catch {
            return null;
        }
    }));
}

export const renderSkin = async (
    data: Bandage[],
    styles: { readonly [key: string]: string; }
): Promise<JSX.Element[]> => {
    const skinViewer = new SkinViewer({
        width: 300,
        height: 300,
        renderPaused: true
    });
    skinViewer.camera.rotation.x = -0.4;
    skinViewer.camera.rotation.y = 0.8;
    skinViewer.camera.rotation.z = 0.29;
    skinViewer.camera.position.x = 17;
    skinViewer.camera.position.y = 6.5;
    skinViewer.camera.position.z = 11;
    try {
        await skinViewer.loadBackground('/static/background.png');
        const base_skin = await asyncImage('/static/workshop_base.png');
        const result = await render(skinViewer, data, styles, base_skin);
        return result;
    } finally {
        skinViewer.dispose();
    }
}