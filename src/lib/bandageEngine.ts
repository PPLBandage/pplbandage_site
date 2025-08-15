import asyncImage, { base64Encode } from '@/lib/asyncImage';
import { getSkin } from './api/minecraft';

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
    cape: string | null = null;
    original_canvas: HTMLCanvasElement | null = null;

    pepe_canvas: HTMLCanvasElement | null = null;
    lining_canvas: HTMLCanvasElement | null = null;

    pepe_canvas_slim: HTMLCanvasElement | null = null;
    lining_canvas_slim: HTMLCanvasElement | null = null;

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

    onRendered:
        | (({
              skin,
              cape,
              slim
          }: {
              skin: string;
              cape: string | null;
              slim: boolean;
          }) => void)
        | undefined = undefined;
    onInit: (() => void) | undefined = undefined;

    private main_bandage: HTMLCanvasElement | null = null;

    async loadBase() {
        // Грузим базовый скин в `original_canvas`
        const skin = await asyncImage('/static/workshop_base.png');
        const context = this.original_canvas!.getContext('2d');
        context!.drawImage(skin, 0, 0);
    }

    init() {
        // Инициализируем канваз для исходного скина
        this.original_canvas = document.createElement('canvas');
        this.original_canvas.width = 64;
        this.original_canvas.height = 64;

        // Вешаем ивентлистенеры на колорпикер
        const color_picker = document.getElementById('color_picker');
        color_picker?.addEventListener('input', () => this.rerender());

        // Грузим базовый скин и вызываем колбек на инициализацию
        this.loadBase().then(() => this.onInit?.());
    }

    /** Загрузить скин по нику в движок */
    async loadSkin(nickname: string): Promise<void> {
        if (!nickname) return;

        const data = await getSkin(nickname);
        this.slim = data.slim; // Установка тонких рук

        this.setOriginalCanvas(b64Prefix + data.skin, () => {
            this.skin = b64Prefix + data.skin;
            this.cape = b64Prefix + data.cape;

            this.rerender();
        });
    }

    /** Загрузка скина с URL */
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

    /** Загрузить скин из base64 */
    loadSkinBase64(skin_b64: string, slim?: boolean, cape?: string) {
        if (slim !== undefined) this.slim = slim;
        this.setOriginalCanvas(skin_b64, () => {
            this.skin = skin_b64;
            this.cape = cape ?? null;

            this.rerender();
        });
    }

    /**
    Синхронно сохранить исходный base64 в канваз `original_canvas`  
    Вызывает `callback` при успешной загрузке
    */
    private setOriginalCanvas(b64: string, callback: () => void) {
        const context = this.original_canvas!.getContext('2d');
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

    /**
    Синхронно загрузить повязку из изображения  
    `slim` – повязка предназначена для тонких рук (используется в раздельном типе)
    */
    loadFromImage(img: HTMLImageElement, slim?: boolean) {
        const height = img.height / 2;

        // Грузим первый слой повязки в канваз
        const first_layer = document.createElement('canvas');
        const first_layer_ctx = first_layer.getContext('2d')!;
        first_layer.width = 16;
        first_layer.height = height;

        // Грузим второй слой повязки в канваз
        const second_layer = document.createElement('canvas');
        const second_layer_ctx = second_layer.getContext('2d')!;
        second_layer.width = 16;
        second_layer.height = height;

        first_layer_ctx.drawImage(img, 0, height, 16, height, 0, 0, 16, height);
        second_layer_ctx.drawImage(img, 0, 0, 16, height, 0, 0, 16, height);

        if (slim) {
            this.pepe_canvas_slim = second_layer;
            this.lining_canvas_slim = first_layer;
        } else {
            this.pepe_canvas = second_layer;
            this.lining_canvas = first_layer;
        }

        this.position = 6 - Math.floor(height / 2);
        this.rerender();
    }

    /** Изменить состояние тонких рук */
    changeSlim(slim: boolean) {
        this.slim = slim;
        this.rerender();
    }

    /** Установить параметры рендера */
    setParams(props: Settings) {
        Object.entries(props).forEach(([key, value]) => {
            Object.defineProperty(this, key, { value });
        });
        this.rerender();
    }

    //-----------RENDER-------------
    /**
    Синхронно выполнит рендер повязки на скин  
    `render_original` – нужно ли рендерить оригинальный скин
    */
    rerender(render_original: boolean = true, download?: boolean) {
        const canvas = document.createElement('canvas');
        canvas.width = 64;
        canvas.height = 64;

        // Копируем повязки в локальные переменные
        let second_layer_canvas = this.pepe_canvas;
        let first_layer_canvas = this.lining_canvas;

        // При раздельных типах и тонких руках - грузим повязки для тонких рук
        // Не будет вызвано если повязка на ноге
        if (this.split_types && this.slim && [0, 2].includes(this.body_part)) {
            second_layer_canvas = this.pepe_canvas_slim;
            first_layer_canvas = this.lining_canvas_slim;
        }

        if (!second_layer_canvas || !first_layer_canvas) return;

        // Результативный канваз
        const canvas_context = canvas.getContext('2d', {
            willReadFrequently: true
        })!;
        canvas_context.clearRect(0, 0, canvas.width, canvas.height);

        // Рисуем базовый скин
        if (render_original) canvas_context.drawImage(this.original_canvas!, 0, 0);

        const height = second_layer_canvas.height;

        // Обрезаем второй слой
        let second_layer = this.crop_pepe(
            second_layer_canvas,
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
        })!;

        // Обрезаем первый слой
        let first_layer = this.crop_pepe(
            first_layer_canvas,
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
        })!;

        // Если повязка окрашиваемая - красим
        if (this.colorable) {
            const rgb = hex2rgb(this.color);
            second_layer = fillPepe(second_layer, rgb);
            first_layer = fillPepe(first_layer, rgb);
        }

        // Очищаем пиксели над повязкой
        if (this.clear_pix) {
            clearPepe(
                canvas,
                body_part_x_overlay[this.body_part],
                body_part_y_overlay[this.body_part] + this.position,
                height
            );
        }

        // Коэффициент смещения повязки относительно себя
        // Смещение на один пиксель вправо, если руки тонкие и повязка на руках
        const coef =
            this.slim && (this.body_part == 0 || this.body_part == 2) ? 1 : 0;

        // Рисуем повязки на их холсты
        ctx_pepe.drawImage(
            second_layer,
            coef,
            0,
            second_layer.width - coef,
            height,
            0,
            0,
            second_layer.width - coef,
            height
        );
        ctx_lining.drawImage(
            first_layer,
            coef,
            0,
            first_layer.width - coef,
            height,
            0,
            0,
            first_layer.width - coef,
            height
        );

        // Берем координаты для рендеринга повязки
        let overlay_x = body_part_x_overlay[this.body_part];
        let overlay_y = body_part_y_overlay[this.body_part];

        let first_x = body_part_x[this.body_part];
        let first_y = body_part_y[this.body_part];

        this.main_bandage = cropped_lining;

        // В соответствие с выбранным слоем отрисовки выбираем координаты
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

        // Рендерим повязку на результативный канваз
        if (this.first_layer)
            canvas_context.drawImage(
                cropped_lining,
                first_x,
                first_y + this.position
            );

        if (this.second_layer)
            canvas_context.drawImage(
                cropped_pepe,
                overlay_x,
                overlay_y + this.position
            );

        // Вызываем колбек после рендера
        if (!download) {
            this.skin = canvas.toDataURL();
            if (this.onRendered)
                this.onRendered({
                    skin: this.skin,
                    cape: this.cape,
                    slim: this.slim
                });
        } else {
            this.download(canvas.toDataURL());
        }
    }

    /** Вычислить средний цвет повязки */
    calcColor() {
        const on_second_layer = this.layers === '2'; // Брать пиксели со второго слоя

        const pos_x = on_second_layer
            ? body_part_x_overlay[this.body_part]
            : body_part_x[this.body_part];
        const pos_y =
            (on_second_layer
                ? body_part_y_overlay[this.body_part]
                : body_part_y[this.body_part]) + this.position;

        const skin_context = this.original_canvas!.getContext('2d', {
            willReadFrequently: true
        })!;
        const bandage_data = skin_context.getImageData(
            pos_x,
            pos_y,
            this.main_bandage!.width,
            this.main_bandage!.height
        ).data;

        let r_avg = 0;
        let g_avg = 0;
        let b_avg = 0;
        let count = 0;

        for (let y = 0; y < this.main_bandage!.height; y++) {
            for (let x = 0; x < 16; x++) {
                const index = (y * this.main_bandage!.height + x) * 4;
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

    /** Скачать base64 изображение */
    download(skin?: string, name?: string) {
        const link = document.createElement('a');
        link.download = name || 'skin.png';
        link.href = skin || this.skin;
        link.click();
    }

    /** Подогнать повязку под соответствующий тип рук/ног */
    crop_pepe(
        pepe_canvas: HTMLCanvasElement,
        slim: boolean,
        height: number,
        body_part: number,
        split_types: boolean
    ): HTMLCanvasElement {
        const bandage_canvas = document.createElement('canvas') as HTMLCanvasElement;
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
    }
}

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
        if (context) context.drawImage(input, 0, 0, input.width, input.height);
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

export default Client;
