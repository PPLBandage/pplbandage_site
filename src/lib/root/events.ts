import events from '@/constants/events.json';
import { SkinObject } from 'skinview3d';

const parseWithoutYear = (s: string, baseYear: number) => {
    const [month, rest] = s.split('-');
    const [day, time] = rest.split('T');
    const [h, m, sec] = time.split(':').map(Number);

    return new Date(baseYear, Number(month) - 1, Number(day), h, m, sec);
};

export type Vector3Array = [number, number, number];

type Event = {
    name: string,
    force: boolean,
    dateStart: Date,
    dateEnd: Date,
    gltf: string,
    initialAnimation?: string,
    bodyPart: keyof SkinObject,
    position: Vector3Array,
    rotation: Vector3Array,
    scale: Vector3Array
}

export const getCurrentEvent = (): Event | null => {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    for (const [k, v] of Object.entries(events) as [string, any][]) {
        const [startStr, endStr] = v.time_period.split('&');

        const now = new Date();
        const start = parseWithoutYear(startStr, now.getFullYear());
        let end = parseWithoutYear(endStr, now.getFullYear());

        if (end < start) {
            end = parseWithoutYear(endStr, now.getFullYear() + 1);
        }

        if (v.force || now >= start && now <= end) return {
            name: k,
            force: v.force ?? false,
            dateStart: start,
            dateEnd: end,
            gltf: v.gltf,
            bodyPart: v.body_part,
            position: v.position,
            rotation: v.rotation,
            scale: v.scale,
            initialAnimation: v.initial_animation
        };
    }

    return null;
};
