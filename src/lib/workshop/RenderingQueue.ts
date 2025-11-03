'use client';

import { SkinViewer } from 'skinview3d';
import asyncImage from '../asyncImage';
import Client, { b64Prefix } from '../bandageEngine';

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
    private engine!: Client;

    constructor() {
        this.init();
    }

    init() {
        if (typeof document === 'undefined') return;
        this.viewer = new SkinViewer({
            width: 300,
            height: 300,
            renderPaused: true
        });

        this.viewer.camera.rotation.x = -0.4;
        this.viewer.camera.rotation.y = 0.8;
        this.viewer.camera.rotation.z = 0.29;
        this.viewer.camera.position.x = 17;
        this.viewer.camera.position.y = 6.5;
        this.viewer.camera.position.z = 11;

        this.viewer.render();

        this.disposed = false;
        this.engine = new Client();
        this.engine.init();
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
            const bandage_img = await asyncImage(b64Prefix + task.data.b64);
            if (task.data.flags & 1) {
                const [r, g, b] = [
                    randint(0, 255),
                    randint(0, 255),
                    randint(0, 255)
                ];
                this.engine.setParams({
                    colorable: true,
                    color:
                        '#' +
                        ((1 << 24) | (r << 16) | (g << 8) | b).toString(16).slice(1)
                });
            }
            this.engine.loadFromImage(bandage_img);
            // После загрузки повязки движок сам ререндерит повязку
            await new Promise(resolve => setTimeout(resolve, 100));
            await this.viewer!.loadSkin(this.engine.skin, { model: 'default' });
            this.viewer!.render();

            const dataURL = this.viewer!.canvas.toDataURL();
            task.resolve(dataURL);
        } catch (e) {
            task.reject(e);
        } finally {
            this.working = false;
            await this.process();
        }
    }
}

const globalForRender = globalThis as unknown as {
    renderQueue?: RenderingQueue;
};
export const renderQueue =
    globalForRender.renderQueue ??
    (globalForRender.renderQueue = new RenderingQueue());
