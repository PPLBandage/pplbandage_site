'use client';

import { SkinViewer } from 'skinview3d';
import asyncImage from '../asyncImage';
import Client, { b64Prefix } from '@/lib/workshop/bandageEngine';

type Vector3Array = [number, number, number];

type TaskDTO = {
    b64: string;
    flags: number;
    back: boolean;
};

type Task = {
    id: number;
    data: TaskDTO;
    resolve: (value: string) => void;
    reject: (err: unknown) => void;
    cancelled: boolean;
};

const randint = (min: number, max: number): number => {
    return Math.random() * (max - min) + min;
};

export class RenderingQueue {
    private queue: Task[] = [];
    private working: boolean = false;
    private taskIdCounter: number = 0;

    private viewer!: SkinViewer | null;
    private disposed: boolean = false;
    private disposeTimer: NodeJS.Timeout | null = null;
    private engine!: Client | null;

    private initPromise: Promise<void> | null = null;

    params_front = {
        camera_pos: [13.89, 3.9, 10.37],
        target: [3.18, 1.28, -3]
    };

    params_back = {
        camera_pos: [13.89, 3.9, -10.37],
        target: [6.45, 2.29, -0.6]
    };

    constructor() {
        this.init();
    }

    init() {
        if (typeof document === 'undefined') return;
        this.viewer = new SkinViewer({
            width: 300,
            height: 300,
            renderPaused: true,
            pixelRatio: 1,
            fov: 65
        });
        this.viewer.render();

        this.disposed = false;
        this.engine = new Client();

        this.initPromise = new Promise(resolve => {
            this.engine!.onInit = resolve;
        });
        this.engine.init();
    }

    async enqueue(
        task: TaskDTO
    ): Promise<{ result: Promise<string>; taskId: number }> {
        const taskId = this.taskIdCounter++;
        const result = new Promise<string>((resolve, reject) => {
            this.queue.push({
                id: taskId,
                resolve,
                reject,
                data: task,
                cancelled: false
            });
            this.process();
        });
        return { result, taskId };
    }

    cancel(taskId: number): boolean {
        const taskIndex = this.queue.findIndex(t => t.id === taskId);
        if (taskIndex !== -1) {
            const task = this.queue[taskIndex];
            task.cancelled = true;
            this.queue.splice(taskIndex, 1);
            task.reject(new Error('Task cancelled'));
            return true;
        }
        return false;
    }

    private async process() {
        // Ожидаем инициализации движка
        if (this.initPromise) {
            await this.initPromise;
            this.initPromise = null;
        }

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
                    this.engine = null;

                    console.log('Renderer disposed');
                }
            }, 5000);
            return;
        }

        if (this.disposed) {
            this.init();
            if (this.initPromise) {
                // TS тут пиздит
                // await нужен, потому что после init у нас все сбрасывается
                await this.initPromise;
                this.initPromise = null;
            }
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
                this.engine!.setParams({
                    colorable: true,
                    color:
                        '#' +
                        ((1 << 24) | (r << 16) | (g << 8) | b).toString(16).slice(1)
                });
            } else {
                this.engine!.setParams({ colorable: false });
            }
            this.engine!.loadFromImage(bandage_img);
            if (this.viewer)
                if (!task.data.back) {
                    this.viewer.camera.position.set(
                        ...(this.params_front.camera_pos as Vector3Array)
                    );
                    this.viewer.controls.target.set(
                        ...(this.params_front.target as Vector3Array)
                    );
                } else {
                    this.viewer.camera.position.set(
                        ...(this.params_back.camera_pos as Vector3Array)
                    );
                    this.viewer.controls.target.set(
                        ...(this.params_back.target as Vector3Array)
                    );
                }
            this.viewer?.controls.update();

            await this.viewer!.loadSkin(this.engine!.skin, { model: 'default' });
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
