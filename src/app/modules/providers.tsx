'use client';

import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { Inter } from 'next/font/google';
import { CSSProperties } from 'react';
import WorkshopCacheListener from './utils/workshopCacheListener';
import themes from '@/app/themes';
import { useCookiesServer } from 'use-next-cookie';

const queryClient = new QueryClient();
const inter = Inter({ subsets: ['latin'] });

export const getTheme = (theme: string) => {
    const keys = Object.keys(themes);
    if (!keys.includes(theme)) return themes.default;

    return themes[theme];
};

const Providers = ({ children }: { children: React.ReactNode }) => {
    const cookie = useCookiesServer();
    const theme = getTheme(cookie.get('theme_main') || 'default');

    return (
        <QueryClientProvider client={queryClient}>
            <html
                lang="ru"
                className={inter.className}
                style={theme.data as CSSProperties}
            >
                <WorkshopCacheListener />
                {children}
            </html>
        </QueryClientProvider>
    );
};

export default Providers;
