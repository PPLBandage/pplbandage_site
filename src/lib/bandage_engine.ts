/* eslint-disable @typescript-eslint/no-unused-expressions */
import asyncImage, { base64Encode } from '@/lib/asyncImage';
import ApiManager from '@/lib/apiManager';

export interface SkinResponse {
    skin: string;
    cape: string;
    slim: boolean;
}

export const b64Prefix = 'data:image/png;base64,';
const body_part_x = [32, 16, 40, 0];
const body_part_y = [52, 52, 20, 20];
const body_part_x_overlay = [48, 0, 40, 0];
const body_part_y_overlay = [52, 52, 36, 36];

interface Settings {
    body_part?: number;
    position?: number;
    clear_pix?: boolean;
    first_layer?: boolean;
    second_layer?: boolean;
    layers?: string;
    color?: string;
    colorable?: boolean;
    split_types?: boolean;
}

class Client {
    skin: string = '';
    cape: string = '';
    original_canvas: HTMLCanvasElement = null;

    pepe_canvas: HTMLCanvasElement = null;
    lining_canvas: HTMLCanvasElement = null;

    pepe_canvas_slim: HTMLCanvasElement = null;
    lining_canvas_slim: HTMLCanvasElement = null;

    body_part: number = 0;
    position: number = 4;
    clear_pix: boolean = true;
    first_layer: boolean = true;
    second_layer: boolean = true;
    layers: string = '0';
    slim: boolean = false;
    color: string = '';
    colorable: boolean = false;
    split_types: boolean = false;

    onRendered: ({
        skin,
        cape,
        slim
    }: {
        skin: string;
        cape: string;
        slim: boolean;
    }) => void = undefined;
    onInit: () => void = undefined;

    private main_bandage: HTMLCanvasElement = null;

    loadBase() {
        asyncImage('/static/workshop_base.png').then(skin => {
            const context = this.original_canvas.getContext('2d');
            context!.drawImage(skin, 0, 0);
            !!this.onInit && this.onInit();
        });
    }

    constructor() {
        this.original_canvas = document.createElement('canvas');
        this.original_canvas.width = 64;
        this.original_canvas.height = 64;
        this.loadBase();

        const color_picker = document.getElementById(
            'color_picker'
        ) as HTMLInputElement;
        color_picker?.addEventListener('input', () => this.rerender());
    }

    async loadSkin(nickname: string): Promise<void> {
        if (!nickname) return;

        const data = await ApiManager.getSkin(nickname);
        this.slim = data.slim;

        this.setOriginalCanvas(b64Prefix + data.skin, () => {
            this.skin = b64Prefix + data.skin;
            this.cape = b64Prefix + data.cape;

            this.rerender();
        });
    }

    loadSkinUrl(url: string) {
        asyncImage(url)
            .then(img => {
                const base64 = base64Encode(img);
                this.setOriginalCanvas(base64, () => {
                    this.skin = base64;
                    this.rerender();
                });
            })
            .catch(console.error);
    }

    private setOriginalCanvas(b64: string, callback: () => void) {
        const context = this.original_canvas.getContext('2d');
        if (!context) {
            return;
        }

        asyncImage(b64).then(img => {
            if (img.width != 64 || img.height != 64) return;
            context.clearRect(0, 0, 64, 64);
            context.drawImage(img, 0, 0, img.width, img.height);
            callback();
        });
    }

    //---------------------bandage_manager-------------------

    loadFromImage(img: HTMLImageElement, slim?: boolean) {
        const height = img.height / 2;
        const pepe_canvas = document.createElement(
            'canvas'
        ) as HTMLCanvasElement;
        const context_pepe = pepe_canvas.getContext('2d');
        pepe_canvas.width = 16;
        pepe_canvas.height = height;

        const lining_canvas = document.createElement(
            'canvas'
        ) as HTMLCanvasElement;
        const context_lining = lining_canvas.getContext('2d');
        lining_canvas.width = 16;
        lining_canvas.height = height;

        context_pepe.drawImage(img, 0, 0, 16, height, 0, 0, 16, height);
        context_lining.drawImage(img, 0, height, 16, height, 0, 0, 16, height);

        if (slim) {
            this.pepe_canvas_slim = pepe_canvas;
            this.lining_canvas_slim = lining_canvas;
        } else {
            this.pepe_canvas = pepe_canvas;
            this.lining_canvas = lining_canvas;
        }
        this.position = 6 - Math.floor(height / 2);

        this.rerender();
    }

    changeSlim(slim: boolean) {
        this.slim = slim;
        this.rerender();
    }

    changeSkin(skin: string, slim?: boolean, cape?: string) {
        if (slim !== undefined) this.slim = slim;
        this.setOriginalCanvas(skin, () => {
            this.skin = skin;
            this.cape = cape;

            this.rerender();
        });
    }

    setParams(props: Settings) {
        Object.entries(props).forEach(([key, value]) => {
            Object.defineProperty(this, key, { value });
        });
        this.rerender();
    }

    //-----------RENDER-------------
    rerender(render_original: boolean = true, download?: boolean) {
        const canvas = document.createElement('canvas');
        canvas.width = 64;
        canvas.height = 64;

        let bandage_canvas = this.pepe_canvas;
        let lining_canvas = this.lining_canvas;

        if (this.split_types && this.slim && [0, 2].includes(this.body_part)) {
            bandage_canvas = this.pepe_canvas_slim;
            lining_canvas = this.lining_canvas_slim;
        }

        if (!bandage_canvas || !lining_canvas) return;

        const canvas_context = canvas.getContext('2d', {
            willReadFrequently: true
        });
        canvas_context.clearRect(0, 0, canvas.width, canvas.height);
        render_original && canvas_context.drawImage(this.original_canvas, 0, 0);

        const height = bandage_canvas.height;

        let pepe = crop_pepe(
            bandage_canvas,
            this.slim,
            height,
            this.body_part,
            this.split_types
        );
        const cropped_pepe = document.createElement('canvas');
        cropped_pepe.width = 16;
        cropped_pepe.height = height;
        const ctx_pepe = cropped_pepe.getContext('2d', {
            willReadFrequently: true
        });

        let lining = crop_pepe(
            lining_canvas,
            this.slim,
            height,
            this.body_part,
            this.split_types
        );
        const cropped_lining = document.createElement('canvas');
        cropped_lining.width = 16;
        cropped_lining.height = height;
        const ctx_lining = cropped_lining.getContext('2d', {
            willReadFrequently: true
        });

        if (this.colorable) {
            const rgb = hex2rgb(this.color);
            pepe = fillPepe(pepe, rgb);
            lining = fillPepe(lining, rgb);
        }

        this.clear_pix &&
            clearPepe(
                canvas,
                body_part_x_overlay[this.body_part],
                body_part_y_overlay[this.body_part] + this.position,
                height
            );

        const coef =
            this.slim && (this.body_part == 0 || this.body_part == 2) ? 1 : 0;
        ctx_pepe.drawImage(
            pepe,
            coef,
            0,
            pepe.width - coef,
            height,
            0,
            0,
            pepe.width - coef,
            height
        );
        ctx_lining.drawImage(
            lining,
            coef,
            0,
            lining.width - coef,
            height,
            0,
            0,
            lining.width - coef,
            height
        );

        let overlay_x = body_part_x_overlay[this.body_part];
        let overlay_y = body_part_y_overlay[this.body_part];

        let first_x = body_part_x[this.body_part];
        let first_y = body_part_y[this.body_part];

        this.main_bandage = cropped_lining;

        switch (this.layers) {
            case '1':
                overlay_x = first_x;
                overlay_y = first_y;
                break;
            case '2':
                first_x = overlay_x;
                first_y = overlay_y;
                break;
        }

        this.first_layer &&
            canvas_context.drawImage(
                cropped_lining,
                first_x,
                first_y + this.position
            );
        this.second_layer &&
            canvas_context.drawImage(
                cropped_pepe,
                overlay_x,
                overlay_y + this.position
            );

        if (!download) {
            this.skin = canvas.toDataURL();
            !!this.onRendered &&
                this.onRendered({
                    skin: this.skin,
                    cape: this.cape,
                    slim: this.slim
                });
        } else {
            this.download(canvas.toDataURL());
        }
    }

    calcColor() {
        const on_second_layer = this.layers === '2'; // Брать пиксели со второго слоя

        const pos_x = on_second_layer
            ? body_part_x_overlay[this.body_part]
            : body_part_x[this.body_part];
        const pos_y =
            (on_second_layer
                ? body_part_y_overlay[this.body_part]
                : body_part_y[this.body_part]) + this.position;

        const skin_context = this.original_canvas.getContext('2d', {
            willReadFrequently: true
        });
        const bandage_data = skin_context.getImageData(
            pos_x,
            pos_y,
            this.main_bandage.width,
            this.main_bandage.height
        ).data;

        let r_avg = 0;
        let g_avg = 0;
        let b_avg = 0;
        let count = 0;

        for (let y = 0; y < this.main_bandage.height; y++) {
            for (let x = 0; x < 16; x++) {
                const index = (y * this.main_bandage.height + x) * 4;
                const r = bandage_data[index];
                const g = bandage_data[index + 1];
                const b = bandage_data[index + 2];
                const a = bandage_data[index + 3];

                if (a !== 0) {
                    r_avg += r;
                    g_avg += g;
                    b_avg += b;
                    count++;
                }
            }
        }
        return {
            r: r_avg / count,
            g: g_avg / count,
            b: b_avg / count
        };
    }

    download(skin?: string, name?: string) {
        const link = document.createElement('a');
        link.download = name || 'skin.png';
        link.href = skin || this.skin;
        link.click();
    }
}

export const crop_pepe = (
    pepe_canvas: HTMLCanvasElement,
    slim: boolean,
    height: number,
    body_part: number,
    split_types: boolean
): HTMLCanvasElement => {
    const bandage_canvas = document.createElement(
        'canvas'
    ) as HTMLCanvasElement;
    bandage_canvas.width = 16;
    bandage_canvas.height = height;
    const context = bandage_canvas.getContext('2d', {
        willReadFrequently: true
    });

    if (slim && (body_part === 0 || body_part === 2)) {
        if (split_types) {
            context?.drawImage(pepe_canvas, 0, 0, 15, height, 0, 0, 15, height);
        } else {
            context?.drawImage(pepe_canvas, 5, 0, 10, height, 5, 0, 10, height);
            context?.drawImage(pepe_canvas, 0, 0, 4, height, 1, 0, 4, height);
        }
    } else {
        context?.drawImage(pepe_canvas, 0, 0);
    }

    if (body_part > 1) {
        const result_canvas = document.createElement(
            'canvas'
        ) as HTMLCanvasElement;
        result_canvas.width = 16;
        result_canvas.height = height;
        const context = result_canvas.getContext('2d', {
            willReadFrequently: true
        });

        const paste_position = !(slim && (body_part == 0 || body_part == 2))
            ? 8
            : 7;
        context?.drawImage(
            bandage_canvas,
            0,
            0,
            8,
            height,
            paste_position,
            0,
            8,
            height
        ); // left
        context?.drawImage(
            bandage_canvas,
            paste_position,
            0,
            8,
            height,
            0,
            0,
            8,
            height
        ); // right
        return result_canvas;
    }
    return bandage_canvas;
};

export const clearPepe = (
    canvas: HTMLCanvasElement,
    pos_x: number,
    pos_y: number,
    height: number
) => {
    const context = canvas.getContext('2d', { willReadFrequently: true });
    if (!context) return;
    context.clearRect(pos_x, pos_y, 16, height);
};

export const fillPepe = (
    input: HTMLCanvasElement | HTMLImageElement,
    color: Array<number>
): HTMLCanvasElement => {
    let canvas: HTMLCanvasElement;
    if (input instanceof HTMLImageElement) {
        canvas = document.createElement('canvas');
        canvas.width = input.width;
        canvas.height = input.height;
        const context = canvas.getContext('2d');
        context && context.drawImage(input, 0, 0, input.width, input.height);
    } else {
        canvas = input;
    }

    const context = canvas.getContext('2d', { willReadFrequently: true });
    if (!context) return canvas;

    const imageData = context.getImageData(0, 0, canvas.width, canvas.height);
    const data = imageData.data;

    for (let y = 0; y < canvas.height; y++) {
        for (let x = 0; x < canvas.width; x++) {
            const index = (y * canvas.width + x) * 4;
            const r = data[index];
            const g = data[index + 1];
            const b = data[index + 2];
            const a = data[index + 3];

            if (a !== 0 && r === g && g === b) {
                data[index] = (r / 255) * color[0];
                data[index + 1] = (g / 255) * color[1];
                data[index + 2] = (b / 255) * color[2];
                data[index + 3] = a;
            }
        }
    }

    context.putImageData(imageData, 0, 0);
    return canvas;
};

const hex2rgb = (hex: string) => {
    const r = parseInt(hex.slice(1, 3), 16);
    const g = parseInt(hex.slice(3, 5), 16);
    const b = parseInt(hex.slice(5, 7), 16);

    return [r, g, b];
};

export const to64 = (skin: HTMLImageElement): HTMLCanvasElement => {
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    if (!ctx) {
        throw new Error('Unable to get canvas context');
    }

    canvas.width = 64;
    canvas.height = 64;

    const leg = document.createElement('canvas');
    const legCtx = leg.getContext('2d');
    if (!legCtx) {
        throw new Error('Unable to get canvas context for leg');
    }
    leg.width = 16;
    leg.height = 16;
    legCtx.drawImage(skin, 0, 16, 16, 16, 0, 0, 16, 16);

    const arm = document.createElement('canvas');
    const armCtx = arm.getContext('2d');
    if (!armCtx) {
        throw new Error('Unable to get canvas context for arm');
    }
    arm.width = 24;
    arm.height = 16;
    armCtx.drawImage(skin, 40, 16, 24, 16, 0, 0, 24, 16);

    ctx.drawImage(leg, 16, 48);
    ctx.drawImage(arm, 32, 48);
    ctx.drawImage(skin, 0, 0);

    // Mirroring functions for easier handling of symmetrical parts
    const mirrorImage = (
        srcCanvas: HTMLCanvasElement,
        sx: number,
        sy: number,
        sw: number,
        sh: number,
        dx: number,
        dy: number
    ) => {
        const tempCanvas = document.createElement('canvas');
        const tempCtx = tempCanvas.getContext('2d');
        if (!tempCtx) {
            throw new Error('Unable to get temporary canvas context');
        }
        tempCanvas.width = sw;
        tempCanvas.height = sh;
        tempCtx.scale(-1, 1);
        tempCtx.drawImage(srcCanvas, sx, sy, sw, sh, -sw, 0, sw, sh);
        ctx.drawImage(tempCanvas, 0, 0, sw, sh, dx, dy, sw, sh);
    };

    mirrorImage(leg, 0, 4, 4, 12, 24, 52);
    mirrorImage(leg, 8, 4, 4, 12, 16, 52);
    mirrorImage(leg, 4, 4, 4, 12, 20, 52);
    mirrorImage(leg, 12, 4, 4, 12, 28, 52);
    mirrorImage(leg, 4, 0, 4, 4, 20, 48);
    mirrorImage(leg, 8, 0, 4, 4, 24, 48);

    mirrorImage(arm, 0, 4, 4, 12, 40, 52);
    mirrorImage(arm, 8, 4, 4, 12, 32, 52);
    mirrorImage(arm, 4, 4, 4, 12, 36, 52);
    mirrorImage(arm, 12, 4, 4, 12, 44, 52);
    mirrorImage(arm, 4, 0, 4, 4, 36, 48);
    mirrorImage(arm, 8, 0, 4, 4, 40, 48);

    return canvas;
};

export default Client;
