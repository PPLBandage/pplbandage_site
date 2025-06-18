export const getRandomColor = () => {
    const letters = '0123456789ABCDEF';
    let color = '#';
    for (let i = 0; i < 6; i++) {
        color += letters[Math.floor(Math.random() * 16)];
    }
    return color;
};

export const componentToHex = (c: number) => {
    const hex = c.toString(16);
    return hex.length == 1 ? '0' + hex : hex;
};

export const rgbToHex = (r: number, g: number, b: number) => {
    return '#' + componentToHex(r) + componentToHex(g) + componentToHex(b);
};
