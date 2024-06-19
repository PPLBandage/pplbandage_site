import axios from 'axios';
import * as Interfaces from "../../interfaces";


interface SkinResponse {
    status: string,
    data: {
        skin: {
            data: string,
            slim: boolean
        },
        cape: string
    }
}

export const b64Prefix = "data:image/png;base64,";
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
    colorable?: boolean
}

class Client {
    skin: string = "";
    cape: string = "";
    pepe_type: string = "";
    listeners: { [key: string]: Function } = {};
    original_canvas: HTMLCanvasElement = null;

    pepe_canvas: HTMLCanvasElement = null;
    lining_canvas: HTMLCanvasElement = null;

    body_part: number = 0;
    position: number = 4;
    clear_pix: boolean = true;
    first_layer: boolean = true;
    second_layer: boolean = true;
    layers: string = "0";
    slim: boolean = false;
    color: string = "";
    colorable: boolean = false;

    loadBase() {
        const skin = new Image();
        skin.onload = () => {
            const context = this.original_canvas.getContext("2d");
            context?.drawImage(skin, 0, 0);
            this.triggerEvent("init");
        };
        skin.src = "/static/workshop_base.png";
    }

    constructor() {
        this.original_canvas = document.createElement('canvas');
        this.original_canvas.width = 64;
        this.original_canvas.height = 64;
        this.loadBase();

        const color_picker = document.getElementById("color_picker") as HTMLInputElement;
        color_picker?.addEventListener("input", () => this.rerender());
    }

    addEventListener(property: string, func: Function) {
        this.listeners[property] = func;
    }

    removeEventListener(property: string) {
        delete this.listeners[property];
    }


    async loadSkin(nickname: string): Promise<void> {
        if (!nickname) {
            return;
        }
        const response = await axios.get(`/api/skin/${nickname}?cape=true`, { validateStatus: () => true });
        if (response.status !== 200) {
            switch (response.status) {
                case 404:
                    this.setError("Игрок с таким никнеймом не найден!");
                    break;
                case 429:
                    this.setError("Сервера Mojang перегружены, пожалуйста, попробуйте через пару минут");
                    break;
                default:
                    this.setError(`Не удалось получить ник! (${response.status})`);
                    break;
            }
            return;
        }

        const data = response.data as SkinResponse;

        this.slim = data.data.skin.slim;
        this.setOriginalCanvas(b64Prefix + data.data.skin.data);

        this.addEventListener("onload", () => {
            this.clearError();
            //this.switchToSelected();

            this.skin = b64Prefix + data.data.skin;
            this.cape = b64Prefix + data.data.cape;

            this.rerender();
            this.removeEventListener("onload");
        })
    }

    async loadSkinFile(event: Interfaces.FileUploadEvent) {
        const file = event.target.files?.item(0);
        if (!file) return;
        const reader = new FileReader();

        reader.onload = () => {
            this.setOriginalCanvas(reader.result as string);

            this.addEventListener("onload", () => {
                this.clearError();
                this.switchToSelected();
                this.skin = reader.result as string;
                this.rerender();
                this.removeEventListener("onload");
            });
        }
        reader.readAsDataURL(file);
    }

    clearSkin() {
        this.skin = "";
        this.cape = "";

        const result_canvas = document.getElementById('hidable_canvas') as HTMLCanvasElement;
        result_canvas.style.display = "none";

        const select_file = document.getElementById('drop_container') as HTMLSpanElement;
        select_file.style.display = "inline-flex";

        const nick = document.getElementById("nick_input") as HTMLInputElement;
        nick.style.display = "block";

        (document.getElementById("steve") as HTMLInputElement).checked = true;

        const context = this.original_canvas.getContext('2d');

        context?.clearRect(0, 0, 64, 64);
        this.loadBase();

        this.rerender();
        this.clearError();
    }

    triggerEvent(property: string, parameters?: string) {
        if (property == "rerender" || this.listeners[property]) {
            switch (property) {
                case "skin_changed":
                    this.listeners[property]({ skin: this.skin, cape: this.cape });
                    break;
                case "onerror":
                    this.setError(parameters as string);
                    break;
                case "rerender":
                    this.rerender();
                    break;
                default:
                    this.listeners[property]();
                    break;
            }
        }
    }

    private setOriginalCanvas(b64: string) {
        const context = this.original_canvas.getContext('2d');
        if (!context) {
            return;
        }
        const img = new Image();

        img.onload = () => {
            if (img.width != 64 || img.height != 64) {
                this.setError('Скин должен иметь размеры 64x64 пикселя');
                return;
            }
            context?.clearRect(0, 0, 64, 64);
            context?.drawImage(img, 0, 0, img.width, img.height);
            //const pixelData = context.getImageData(46, 52, 1, 1).data;
            //this.slim = pixelData[3] !== 255;
            this.triggerEvent("onload");
        }
        img.src = b64;
    }

    private setError(caption: string, p?: HTMLParagraphElement) {
        const error_label = p ? p : (document.getElementById('error_label') as HTMLParagraphElement);
        error_label.innerHTML = caption;
        error_label.style.display = "block";
    }

    private clearError(p?: HTMLParagraphElement) {
        const error_label = p ? p : (document.getElementById('error_label') as HTMLParagraphElement);
        if (error_label) error_label.style.display = "none";
    }

    private switchToSelected() {
        const result_canvas = document.getElementById('hidable_canvas') as HTMLCanvasElement;
        result_canvas.style.display = "inline-flex";

        const select_file = document.getElementById('drop_container') as HTMLSpanElement;
        select_file.style.display = "none";

        const nick = document.getElementById("nick_input") as HTMLInputElement;
        nick.style.display = "none";
    }

    //---------------------bandage_manager-------------------

    load_custom(event: Interfaces.FileUploadEvent) {
        const file = event.target.files?.item(0);
        if (!file) return;
    
        const reader = new FileReader();
        const img = new Image();
        reader.onload = (e) => {
            img.src = e.target?.result as string;
        };
        reader.readAsDataURL(file);

        img.onload = () => {
            let bandage_canvas = document.getElementById("pepe_original_canvas") as HTMLCanvasElement;
            const ctx = bandage_canvas.getContext("2d", { willReadFrequently: true }) as CanvasRenderingContext2D;

            let lining_canvas = document.getElementById("lining_original_canvas") as HTMLCanvasElement;
            const ctx_lining = lining_canvas.getContext("2d", { willReadFrequently: true }) as CanvasRenderingContext2D;

            if (img.height % 2 != 0 || img.width != 16 || (img.height > 24 || img.height < 2)) {
                this.setError("Файл с повязкой должен иметь ширину 16 и высоту от 2 до 24 пикселей", 
                              document.getElementById('error_label_pepe') as HTMLParagraphElement);
                return
            }
            this.clearError(document.getElementById('error_label_pepe') as HTMLParagraphElement);
            let height = Math.floor(img.height / 2);

            bandage_canvas.width = 16;
            bandage_canvas.height = height;

            lining_canvas.width = 16;
            lining_canvas.height = height;

            ctx.drawImage(img, 0, 0, 16, height, 0, 0, 16, height);
            ctx_lining.drawImage(img, 0, height, 16, height, 0, 0, 16, height);
            this.rerender();
        };
    }


    private pasteImageToCanvas(name: string, image: HTMLImageElement) {
        const canvas = document.getElementById(name) as HTMLCanvasElement;
        const context = canvas.getContext("2d", { willReadFrequently: true }) as CanvasRenderingContext2D;
        canvas.width = image.width;
        canvas.height = image.height;
        context.drawImage(image, 0, 0);
    }

    changeSlim(slim: boolean) {
        this.slim = slim;
        this.rerender();
    }

    changeSkin(skin: string, slim?: boolean, cape?: string) {
        if (slim != undefined) this.slim = slim;
        this.setOriginalCanvas(skin);
        this.addEventListener("onload", () => {
            this.clearError();

            this.skin = skin;
            this.cape = cape;

            this.rerender();
            this.removeEventListener("onload");
        })
    }

    setParams({body_part, position, clear_pix, first_layer, second_layer, layers, color, colorable}: Settings) {
        if (body_part != undefined) this.body_part = body_part;
        if (position != undefined) this.position = position;
        if (clear_pix != undefined) this.clear_pix = clear_pix;
        if (first_layer != undefined) this.first_layer = first_layer;
        if (second_layer != undefined) this.second_layer = second_layer;
        if (layers != undefined) this.layers = layers;
        if (color != undefined) this.color = color;
        if (colorable != undefined) this.colorable = colorable;

        this.rerender();
    }

    updatePositionSlider() {
        const value = document.getElementById('position') as HTMLInputElement;
        if (!value) return;
        const height = this.pepe_canvas.height;
        value.max = (12 - height).toString();
        value.value = this.position.toString();
    }


    //-----------RENDER-------------
    rerender(){
        const canvas = document.createElement('canvas');
        canvas.width = 64;
        canvas.height = 64;
        const bandage_canvas = this.pepe_canvas;
        const lining_canvas = this.lining_canvas;

        const canvas_context = canvas.getContext("2d", { willReadFrequently: true })
        canvas_context.clearRect(0, 0, canvas.width, canvas.height);
        canvas_context.drawImage(this.original_canvas, 0, 0);

        const height = bandage_canvas.height;
        //(document.getElementById('position') as HTMLInputElement).max = (12 - height) + "";

        let pepe = crop_pepe(bandage_canvas, this.slim, height, this.body_part);
        let cropped_pepe = document.createElement("canvas");
        cropped_pepe.width = 16;
        cropped_pepe.height = height;
        const ctx_pepe = cropped_pepe.getContext("2d", { willReadFrequently: true });

        let lining = crop_pepe(lining_canvas, this.slim, height, this.body_part);
        let cropped_lining = document.createElement("canvas") as HTMLCanvasElement;
        cropped_lining.width = 16;
        cropped_lining.height = height;
        const ctx_lining = cropped_lining.getContext("2d", { willReadFrequently: true });

        if (this.colorable) {
            const rgb = hex2rgb(this.color);
            pepe = fillPepe(pepe, rgb) as HTMLCanvasElement;
            lining = fillPepe(lining, rgb) as HTMLCanvasElement;
        }

        if (this.clear_pix) clearPepe(canvas, body_part_x_overlay[this.body_part], body_part_y_overlay[this.body_part] + this.position, height);

        const coef = this.slim && (this.body_part == 0 || this.body_part == 2) ? 1 : 0;
        ctx_pepe.drawImage(pepe, coef, 0, pepe.width - coef, height, 0, 0, pepe.width - coef, height);
        ctx_lining.drawImage(lining, coef, 0, lining.width - coef, height, 0, 0, lining.width - coef, height);

        let overlay_x = body_part_x_overlay[this.body_part];
        let overlay_y = body_part_y_overlay[this.body_part];

        let first_x = body_part_x[this.body_part];
        let first_y = body_part_y[this.body_part];

        if (this.layers == "1") {
            overlay_x = first_x;
            overlay_y = first_y;
        }

        if (this.layers == "2") {
            first_x = overlay_x;
            first_y = overlay_y;
        }

        if (this.first_layer){
            canvas_context.drawImage(cropped_lining, first_x, first_y + this.position);
        }

        if (this.second_layer){
            canvas_context.drawImage(cropped_pepe, overlay_x, overlay_y + this.position);
        }
        this.skin = canvas.toDataURL();
        this.triggerEvent("skin_changed");
    }

    download(){
        const link = document.createElement('a');
        link.download = 'skin.png';
        link.href = this.skin;
        link.click();
    }
}

export const crop_pepe = (pepe_canvas: HTMLCanvasElement, slim: boolean, height: number, body_part: number): HTMLCanvasElement => {
    const bandage_canvas = document.createElement("canvas") as HTMLCanvasElement;
    bandage_canvas.width = 16;
    bandage_canvas.height = height;
    const context = bandage_canvas.getContext("2d", { willReadFrequently: true });

    if (slim && (body_part == 0 || body_part == 2)) {
        context?.drawImage(pepe_canvas, 0, 0, 15, height, 0, 0, 15, height);
    } else {
        context?.drawImage(pepe_canvas, 0, 0);
    }

    if (body_part > 1) {
        const result_canvas = document.createElement("canvas") as HTMLCanvasElement;
        result_canvas.width = 16;
        result_canvas.height = height;
        const context = result_canvas.getContext("2d", { willReadFrequently: true });

        const paste_position = !(slim && (body_part == 0 || body_part == 2)) ? 8 : 7;
        context?.drawImage(bandage_canvas, 0, 0, 8, height, paste_position, 0, 8, height);  // left
        context?.drawImage(bandage_canvas, paste_position, 0, 8, height, 0, 0, 8, height);  // right
        return result_canvas;
    }
    return bandage_canvas;
}

export const clearPepe = (canvas: HTMLCanvasElement, pos_x: number, pos_y: number, height: number) => {
    const context = canvas.getContext("2d", { willReadFrequently: true });
    context?.clearRect(pos_x, pos_y, 16, height);
}

export const fillPepe = (input: HTMLCanvasElement | HTMLImageElement, color: Array<number>): HTMLCanvasElement => {
    let canvas: HTMLCanvasElement;
    if (input instanceof HTMLImageElement) {
        canvas = document.createElement('canvas');
        canvas.width = input.width;
        canvas.height = input.height;
        const context = canvas.getContext('2d');
        if (context) {
            context.drawImage(input, 0, 0, input.width, input.height);
        }
    } else {
        canvas = input;
    }

    const context = canvas.getContext("2d", { willReadFrequently: true });
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

            if (a != 0 && r == g && g == b) {
                data[index] = (r / 255) * color[0];
                data[index + 1] = (g / 255) * color[1];
                data[index + 2] = (b / 255) * color[2];
                data[index + 3] = a; // альфа-канал остаётся неизменным
            }
        }
    }

    context.putImageData(imageData, 0, 0);
    return canvas;
}

/*export function get_skin_type() {
    return (document.getElementById("steve") as HTMLInputElement)?.checked ? "steve" : "alex";
}*/

const hex2rgb = (hex: string) => {
    const r = parseInt(hex.slice(1, 3), 16);
    const g = parseInt(hex.slice(3, 5), 16);
    const b = parseInt(hex.slice(5, 7), 16);
    
    return [ r, g, b ];
}

export default Client;