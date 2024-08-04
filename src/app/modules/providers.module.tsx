'use client';

import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { useCookies } from "next-client-cookies";
import { Inter } from "next/font/google";
import { CSSProperties } from "react";

const queryClient = new QueryClient();
const inter = Inter({ subsets: ["latin"] });

const getTheme = (theme: string) => {
    switch (theme) {
        case 'default':
            return {
                bg: '#17181c',
                card_color: '#262930',
                element_color: '#434957',
                action_color: '#00ADB5',
                menu: '#252a30',
                dark_hover: '#1d2025',
                hr: '#596172',
                focus_color: '#717b91',
                category: '#717b91',
                main_color: '#ffffff',
                shadow: '#1d2025'
            }
        case 'amoled':
            return {
                bg: '#000000',
                card_color: '#101013',
                element_color: '#222329',
                action_color: '#00ADB5',
                menu: '#101013',
                dark_hover: '#1d2025',
                hr: '#292c33',
                focus_color: '#717b91',
                category: '#333845',
                main_color: '#ffffff',
                shadow: '#121212'
            }
        default:
            return {
                bg: '#17181c',
                card_color: '#262930',
                element_color: '#434957',
                action_color: '#00ADB5',
                menu: '#252a30',
                dark_hover: '#1d2025',
                hr: '#596172',
                focus_color: '#717b91',
                category: '#717b91',
                main_color: '#ffffff',
                shadow: '#1d2025'
            }
    }
}

const Providers = ({ children }: { children: React.ReactNode }) => {
    const cookies = useCookies();
    const theme_cookie = cookies.get('theme_main') || 'default';

    const theme = getTheme(theme_cookie);
    return (
        <QueryClientProvider client={queryClient}>
            <html lang="ru" className={inter.className} style={{
                '--main-bg-color': theme.bg,
                '--main-card-color': theme.card_color,
                '--main-element-color': theme.element_color,
                '--main-action-color': theme.action_color,
                '--main-menu-color': theme.menu,
                '--dark-hover': theme.dark_hover,
                '--hr-color': theme.hr,
                '--focus-color': theme.focus_color,
                '--category-color': theme.category,
                '--main-text-color': theme.main_color,
                '--main-shadow-color': theme.shadow
            } as CSSProperties}>
                {children}
            </html>
        </QueryClientProvider>
    )
}

export default Providers;