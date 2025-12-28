const hashString = (str: string) => {
    let hash = 0;
    for (let i = 0; i < str.length; i++) {
        hash = (hash << 5) - hash + str.charCodeAt(i);
        hash |= 0; // int32
    }
    return hash >>> 0; // unsigned
};

const mulberry32 = (seed: number): (() => number) => {
    return function () {
        let t = (seed += 0x6d2b79f5);
        t = Math.imul(t ^ (t >>> 15), t | 1);
        t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
        return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
    };
};

/*
Я мог бы засунуть эту функцию в colorUtils.ts,
но мне так пофиг, если честно
*/
const randomHex = (rng: () => number) => {
    const color = Math.floor(rng() * 0xffffff);
    return '#' + color.toString(16).padStart(6, '0');
};

export const generateTwoColors = (str: string) => {
    const seed = hashString(str);
    const rng = mulberry32(seed);

    return [randomHex(rng), randomHex(rng)];
};
