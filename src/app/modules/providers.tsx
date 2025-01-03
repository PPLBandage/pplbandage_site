'use client';

import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Inter } from "next/font/google";
import { CSSProperties } from "react";
import WorkshopCacheListener from "./utils/workshopCacheListener";
import { useCookiesServer } from "./utils/CookiesProvider/CookieProvider";

const queryClient = new QueryClient();
const inter = Inter({ subsets: ["latin"] });

export const getTheme = (theme: string) => {
    switch (theme) {
        case 'amoled':
            return {
                '--main-bg-color': '#000000',
                '--main-card-color': '#101013',
                '--main-element-color': '#222329',
                '--main-action-color': '#00ADB5',
                '--main-menu-color': '#101013',
                '--dark-hover': '#1d2025',
                '--hr-color': '#292c33',
                '--focus-color': '#717b91',
                '--category-color': '#333845',
                '--main-text-color': '#ffffff',
                '--main-shadow-color': '#121212'
            }
        default:
            return {
                '--main-bg-color': '#17181c',
                '--main-card-color': '#262930',
                '--main-element-color': '#434957',
                '--main-action-color': '#00ADB5',
                '--main-menu-color': '#252a30',
                '--dark-hover': '#1d2025',
                '--hr-color': '#596172',
                '--focus-color': '#717b91',
                '--category-color': '#717b91',
                '--main-text-color': '#ffffff',
                '--main-shadow-color': '#1d2025'
            }
    }
}

const Providers = ({ children }: { children: React.ReactNode }) => {
    const cookie = useCookiesServer();
    const theme_cookie = cookie.get('theme_main') || 'default';

    const theme = getTheme(theme_cookie as string);
    return (
        <QueryClientProvider client={queryClient}>
            <html lang="ru" className={inter.className} style={theme as CSSProperties}>
                <WorkshopCacheListener />
                {children}
            </html>
        </QueryClientProvider>
    )
}

export default Providers;