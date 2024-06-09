import { useState, useRef, useEffect } from 'react';
import axios from 'axios';
import React from 'react';
import * as Interfaces from "./interfaces";

interface SkinResponse {
    status: string,
    data: {
        skin: string,
        cape: string
    }
}

const b64Prefix = "data:image/png;base64,";
const body_part_x = [32, 16, 40, 0];
const body_part_y = [52, 52, 20, 20];
const body_part_x_overlay = [48, 0, 40, 0];
const body_part_y_overlay = [52, 52, 36, 36];

class Client {
    skin: string = "";
    cape: string = "";
    pepe_type: string = "";
    listeners: { [key: string]: Function } = {};

    loadSteve() {
        const skin = new Image();
        skin.onload = () => {
            const canvas = document.getElementById("original_canvas") as HTMLCanvasElement;
            const context = canvas.getContext("2d");
            context?.drawImage(skin, 0, 0);
            this.rerender();
        };
        skin.src = "./static/steve.png";
    }

    constructor() {
        this.loadSteve();

        const color_picker = document.getElementById("color_picker") as HTMLInputElement;
        color_picker.addEventListener("input", () => this.rerender());
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
        const response = await axios.get(`https://new-eldraxis.andcool.ru/skin/${nickname}?cape=true`, { validateStatus: () => true });
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

        this.setOriginalCanvas(b64Prefix + data.data.skin);

        this.addEventListener("onload", () => {
            this.clearError();
            this.switchToSelected();

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

        const canvas = document.getElementById('original_canvas') as HTMLCanvasElement;
        const context = canvas.getContext('2d');

        context?.clearRect(0, 0, 64, 64);
        this.loadSteve();

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
        const canvas = document.getElementById('original_canvas') as HTMLCanvasElement;
        const context = canvas.getContext('2d');
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
            const pixelData = context.getImageData(46, 52, 1, 1).data;
            (document.getElementById(pixelData[3] === 255 ? "steve" : "alex") as HTMLInputElement).checked = true;
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
        const error_label = p ? p :(document.getElementById('error_label') as HTMLParagraphElement);
        error_label.style.display = "none";
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

    bandage_load(name: string) {
        const bandage = new Image();
        bandage.onload = () => {
            this.pasteImageToCanvas("pepe_original_canvas", bandage);
            this.rerender();
        };
        bandage.src = `./static/pepes/colored/${name}.png`;

        const lining = new Image();
        lining.onload = () => {
            this.pasteImageToCanvas("lining_original_canvas", lining);
            this.rerender();
        };
        lining.src = `./static/lining/colored/${name}.png`;
    }

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


    //-----------RENDER-------------
    rerender(){

        const canvas = document.getElementById('result_skin_canvas') as HTMLCanvasElement;
        const skin_canvas = document.getElementById('original_canvas') as HTMLCanvasElement;
        const bandage_canvas = document.getElementById('pepe_original_canvas') as HTMLCanvasElement;
        const lining_canvas = document.getElementById('lining_original_canvas') as HTMLCanvasElement;

        const ctx = canvas.getContext("2d", { willReadFrequently: true }) as CanvasRenderingContext2D;
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        ctx.drawImage(skin_canvas, 0, 0);

        const height = Math.max(bandage_canvas.height, lining_canvas.height);
        (document.getElementById('position') as HTMLInputElement).max = (12 - height) + "";
        const slim = get_skin_type() == 'alex' ? true : false;
        const body_part = parseInt((document.getElementById('body_part') as HTMLInputElement).value);
        const position = parseFloat((document.getElementById('position') as HTMLInputElement).value);
        const clear_pix = (document.getElementById('clear') as HTMLInputElement).checked;

        let pepe = crop_pepe(bandage_canvas, slim, height, body_part);
        let cropped_pepe = document.createElement("canvas") as HTMLCanvasElement;
        cropped_pepe.width = 16;
        cropped_pepe.height = height;
        const ctx_pepe = cropped_pepe.getContext("2d", { willReadFrequently: true }) as CanvasRenderingContext2D;

        let lining = crop_pepe(lining_canvas, slim, height, body_part);
        let cropped_lining = document.createElement("canvas") as HTMLCanvasElement;
        cropped_lining.width = 16;
        cropped_lining.height = height;
        const ctx_lining = cropped_lining.getContext("2d", { willReadFrequently: true }) as CanvasRenderingContext2D;

        if (this.pepe_type == "pepe" || this.pepe_type == "pepe_1") {
            const color_picker = document.getElementById("color_picker") as HTMLInputElement;
            const rgb = hex2rgb(color_picker.value);
            pepe = fillPepe(pepe, rgb) as HTMLCanvasElement;
            lining = fillPepe(lining, rgb) as HTMLCanvasElement;
        }

        if (clear_pix) clearPepe(canvas, body_part_x_overlay[body_part], body_part_y_overlay[body_part] + position, height);

        const coef = slim && (body_part == 0 || body_part == 2) ? 1 : 0;
        ctx_pepe.drawImage(pepe, coef, 0, pepe.width - coef, height, 0, 0, pepe.width - coef, height);
        ctx_lining.drawImage(lining, coef, 0, lining.width - coef, height, 0, 0, lining.width - coef, height);

        const first_layer = document.getElementById("first_layer") as HTMLInputElement;
        const second_layer = document.getElementById("second_layer") as HTMLInputElement;

        const layers = (document.getElementById("layers") as HTMLSelectElement).value;
        let overlay_x = body_part_x_overlay[body_part];
        let overlay_y = body_part_y_overlay[body_part];

        let first_x = body_part_x[body_part];
        let first_y = body_part_y[body_part];

        if (layers == "1") {
            overlay_x = first_x;
            overlay_y = first_y;
        }

        if (layers == "2") {
            first_x = overlay_x;
            first_y = overlay_y;
        }

        if (first_layer.checked){
            ctx.drawImage(cropped_lining, first_x, first_y + position);
        }

        if (second_layer.checked){
            ctx.drawImage(cropped_pepe, overlay_x, overlay_y + position);
        }
        this.skin = canvas.toDataURL();
        this.triggerEvent("skin_changed");
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

export function get_skin_type() {
    return (document.getElementById("steve") as HTMLInputElement).checked ? "steve" : "alex";
}

const hex2rgb = (hex: string) => {
    const r = parseInt(hex.slice(1, 3), 16);
    const g = parseInt(hex.slice(3, 5), 16);
    const b = parseInt(hex.slice(5, 7), 16);
    
    return [ r, g, b ];
}

export default Client;