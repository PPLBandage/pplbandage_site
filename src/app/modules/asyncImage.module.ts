const asyncImage = (src: string): Promise<HTMLImageElement> => {
    return new Promise((resolve, reject) => {
        const img = new Image();
        img.src = src;

        img.onload = () => resolve(img);
        img.onerror = () => reject(new Error("Failed to load image"));
    });
}

export default asyncImage;