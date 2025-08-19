import AsyncImage from './asyncImage';

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

export const getAverageColor = async (url: string) => {
    const image = await AsyncImage(url);
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d')!;

    canvas.width = image.naturalWidth;
    canvas.height = image.naturalHeight;

    ctx.drawImage(image, 0, 0);

    const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
    const data = imageData.data;

    let r = 0,
        g = 0,
        b = 0;

    for (let i = 0; i < data.length; i += 4) {
        r += data[i]; // R
        g += data[i + 1]; // G
        b += data[i + 2]; // B
    }

    const pixelCount = data.length / 4;
    r = Math.round(r / pixelCount);
    g = Math.round(g / pixelCount);
    b = Math.round(b / pixelCount);

    return { r, g, b };
};

export const hexToRgb = (hex: string) => {
    hex = hex.trim().replace(/^#/, '').toLowerCase();

    if (![3, 6].includes(hex.length)) {
        throw new Error('Invalid hex color format');
    }

    if (hex.length === 3) {
        hex = hex
            .split('')
            .map(ch => ch + ch)
            .join('');
    }

    const r = parseInt(hex.substring(0, 2), 16);
    const g = parseInt(hex.substring(2, 4), 16);
    const b = parseInt(hex.substring(4, 6), 16);

    return { r, g, b };
};
