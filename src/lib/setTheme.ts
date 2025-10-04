import { getTheme } from '@/components/root/providers';
import { setCookie } from 'cookies-next';
import { flushSync } from 'react-dom';

export const toggleTheme = async (
    x: number,
    y: number,
    name: string,
    callback: (name: string) => void
) => {
    if (!('startViewTransition' in document)) {
        callback(name);
        return;
    }

    await document.startViewTransition(() => {
        flushSync(() => {
            callback(name);
        });
    }).ready;

    const maxRadius = Math.hypot(
        Math.max(x, window.innerWidth - x),
        Math.max(y, window.innerHeight - y)
    );

    document.documentElement.animate(
        {
            clipPath: [
                `circle(0px at ${x}px ${y}px)`,
                `circle(${maxRadius}px at ${x}px ${y}px)`
            ]
        },
        {
            duration: 500,
            easing: 'ease-in-out',
            pseudoElement: '::view-transition-new(root)'
        }
    );
};

export const setTheme = (name: string) => {
    const theme = getTheme(name);
    setCookie('theme_main', name, { maxAge: 60 * 24 * 365 * 10 });
    Object.entries(theme.data).map(entry =>
        document.documentElement.style.setProperty(entry[0], entry[1] as string)
    );
};
