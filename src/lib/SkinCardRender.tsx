import { Bandage } from '@/types/global.d';
import { Card } from '@/components/workshop/Card';
import { SkinViewer } from 'skinview3d';
import asyncImage from '@/lib/asyncImage';
import { b64Prefix, fillPepe } from '@/lib/bandage_engine';
import { rgbToHex } from '@/app/workshop/[id]/client';
import { JSX } from 'react';

const randint = (min: number, max: number): number => {
    return Math.random() * (max - min) + min;
};

export const generateSkin = async (
    b64: string,
    base_skin: HTMLImageElement,
    color?: number[]
): Promise<HTMLCanvasElement> => {
    const bandage = await asyncImage(b64Prefix + b64);

    const height = Math.floor(bandage.height / 2);
    const position = 6 - Math.ceil(height / 2);

    const skin_canvas = document.createElement('canvas');
    const skin_context = skin_canvas.getContext('2d');
    skin_canvas.width = 64;
    skin_canvas.height = 64;

    const bandage_new = !!color ? fillPepe(bandage, color) : bandage;
    skin_context.drawImage(base_skin, 0, 0);
    skin_context.drawImage(
        bandage_new,
        0,
        0,
        16,
        height,
        48,
        52 + position,
        16,
        height
    );
    skin_context.drawImage(
        bandage_new,
        0,
        height,
        16,
        height,
        32,
        52 + position,
        16,
        height
    );

    return skin_canvas;
};

export const render = (
    skinViewer: SkinViewer,
    data: Bandage[],
    styles: { [key: string]: string },
    base_skin: HTMLImageElement
): Promise<JSX.Element[]> =>
    Promise.all(
        data.map(async el => {
            const colorable = el.flags & 1;
            const random_color = [
                randint(0, 255),
                randint(0, 255),
                randint(0, 255)
            ];

            const result = await generateSkin(
                el.base64,
                base_skin,
                colorable ? random_color : undefined
            );

            skinViewer.loadSkin(result, { model: 'default' });
            skinViewer.render();

            if (colorable) {
                el.accent_color = rgbToHex(
                    ~~random_color[0],
                    ~~random_color[1],
                    ~~random_color[2]
                );
            }

            return (
                <Card
                    el={el}
                    base64={skinViewer.canvas.toDataURL()}
                    key={el.id}
                    className={styles}
                />
            );
        })
    );

export const renderSkin = async (
    data: Bandage[],
    styles: { [key: string]: string }
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
        const base_skin = await asyncImage('/static/workshop_base.png');
        return await render(skinViewer, data, styles, base_skin);
    } finally {
        skinViewer.dispose();
    }
};
