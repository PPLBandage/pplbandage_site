'use client';

import { Inter } from 'next/font/google';
import { CSSProperties, useEffect } from 'react';
import WorkshopCacheListener from '@/lib/workshopCacheListener';
import themes from '@/constants/themes';
import { useCookiesServer } from 'use-next-cookie';
const inter = Inter({ subsets: ['latin'] });

export const getTheme = (theme: string) => {
    const keys = Object.keys(themes);
    if (!keys.includes(theme)) return themes.amoled;

    return themes[theme];
};

const Providers = ({ children }: { children: React.ReactNode }) => {
    const cookie = useCookiesServer();
    const theme = getTheme(cookie.get('theme_main') || 'amoled');

    useEffect(() => {
        console.log(
            `%cЧувак, ты думал тут что-то будет?\n` +
                `Ооо... Нееет...\n` +
                `Давай, закрывай консоль и продолжай пользоваться сайтом :pwgood3:`,
            'font-size: 1.3rem;'
        );
    }, []);

    return (
        <html
            lang="ru"
            className={inter.className}
            style={theme.data as CSSProperties}
        >
            <WorkshopCacheListener />
            {children}
        </html>
    );
};

export default Providers;
