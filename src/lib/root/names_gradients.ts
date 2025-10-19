import gradients from '@/constants/names_gradients.json';

type GradientsType = { [key: string]: string[] };
export const getCssGradientString = (name: string): string => {
    name = name.toLowerCase();
    const typedGradients = gradients as GradientsType;

    const gradient = typedGradients[name];
    if (!gradient) return 'var(--main-text-color)';

    const length = gradient.length - 1;
    const gradient_colors = gradient
        .map((color, index) => `${color} ${(index / length) * 100}%`)
        .join(', ');

    return `linear-gradient(to right, ${gradient_colors})`;
};
