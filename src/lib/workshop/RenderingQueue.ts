'use client';

import { SkinViewer } from 'skinview3d';
import asyncImage from '../asyncImage';
import { b64Prefix, fillPepe } from '../bandageEngine';

type TaskDTO = {
    b64: string;
    flags: number;
};

type Task = {
    data: TaskDTO;
    resolve: (value: string) => void;
    reject: (err: unknown) => void;
};

const randint = (min: number, max: number): number => {
    return Math.random() * (max - min) + min;
};

export class RenderingQueue {
    private queue: Task[] = [];
    private working: boolean = false;

    private viewer!: SkinViewer | null;
    private disposed: boolean = false;
    private disposeTimer: NodeJS.Timeout | null = null;
    private baseSkin!: HTMLImageElement;

    constructor() {
        this.loadSkin().then(() => this.init());
    }

    private async loadSkin() {
        this.baseSkin = await asyncImage('/static/workshop_base.png');
    }

    init() {
        if (typeof document === 'undefined') return;
        this.viewer = new SkinViewer({
            width: 400,
            height: 400,
            renderPaused: true
        });

        this.disposed = false;
    }

    async enqueue(task: TaskDTO): Promise<string> {
        return new Promise((resolve, reject) => {
            this.queue.push({
                resolve,
                reject,
                data: task
            });
            this.process();
        });
    }

    private async generateSkin(
        b64: string,
        base_skin: HTMLImageElement,
        color?: number[]
    ): Promise<HTMLCanvasElement> {
        const bandage = await asyncImage(b64Prefix + b64);

        const height = Math.floor(bandage.height / 2);
        const position = 6 - Math.ceil(height / 2);

        const skin_canvas = document.createElement('canvas');
        const skin_context = skin_canvas.getContext('2d')!;
        skin_canvas.width = 64;
        skin_canvas.height = 64;

        const bandage_new = color ? fillPepe(bandage, color) : bandage;
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
    }

    private async process() {
        if (this.working) return;
        const task = this.queue.shift();
        if (!task) {
            if (this.disposeTimer) clearTimeout(this.disposeTimer);
            this.disposeTimer = setTimeout(() => {
                if (this.queue.length === 0 && !this.working) {
                    this.viewer!.dispose();
                    this.disposed = true;
                    this.disposeTimer = null;
                    this.viewer = null;

                    console.log('Renderer disposed');
                }
            }, 5000);
            return;
        }

        if (this.disposed) {
            this.init();
        }

        if (this.disposeTimer) {
            clearTimeout(this.disposeTimer);
            this.disposeTimer = null;
        }

        this.working = true;

        try {
            const colorable = task.data.flags & 1;
            const random_color = [randint(0, 255), randint(0, 255), randint(0, 255)];

            const result = await this.generateSkin(
                task.data.b64,
                this.baseSkin,
                colorable ? random_color : undefined
            );

            this.viewer!.loadSkin(result, { model: 'default' });
            this.viewer!.render();

            const dataURL = this.viewer!.canvas.toDataURL();
            task.resolve(dataURL);
        } catch (e) {
            task.reject(e);
        } finally {
            this.working = false;
            queueMicrotask(() => this.process());
        }
    }
}

const globalForRender = globalThis as unknown as {
    renderQueue?: RenderingQueue;
};
export const renderQueue =
    globalForRender.renderQueue ??
    (globalForRender.renderQueue = new RenderingQueue());
