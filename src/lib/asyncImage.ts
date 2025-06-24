// Боже, как же я обожаю промисы
/** Асинхронно загрузить изображение */
const AsyncImage = (src: string): Promise<HTMLImageElement> =>
    new Promise((resolve, reject) => {
        const img = new Image();
        img.src = src;

        img.onload = () => resolve(img);
        img.onerror = reject;
    });

/** Синхронно получить картинку как base64 */
export const base64Encode = (img: HTMLImageElement) => {
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    canvas.height = img.naturalHeight;
    canvas.width = img.naturalWidth;
    ctx.drawImage(img, 0, 0);
    return canvas.toDataURL();
};

export default AsyncImage;
