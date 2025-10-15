import hats from '@/constants/hats.json';

const parseWithoutYear = (s: string, baseYear: number) => {
    const [month, rest] = s.split('-');
    const [day, time] = rest.split('T');
    const [h, m, sec] = time.split(':').map(Number);

    return new Date(baseYear, Number(month) - 1, Number(day), h, m, sec);
};

export const getCurrentEvent = () => {
    for (const [k, v] of Object.entries(hats)) {
        if (v.force) return v;
        const [startStr, endStr] = k.split('&');

        const now = new Date();
        const start = parseWithoutYear(startStr, now.getFullYear());
        let end = parseWithoutYear(endStr, now.getFullYear());

        if (end < start) {
            end = parseWithoutYear(endStr, now.getFullYear() + 1);
        }

        if (now >= start && now <= end) return v;
    }

    return null;
};
