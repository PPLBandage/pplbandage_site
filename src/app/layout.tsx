import type { Metadata } from "next";
import Providers from "@/app/modules/providers";
import "./styles/layout.css";
import { CookiesProvider } from 'next-client-cookies/server';
import { headers } from 'next/headers';
import meta from '@/app/meta.json';
import { merge } from 'lodash';

export const generateMetadata = async (): Promise<Metadata | undefined> => {
    const headersList = headers();
    const path = headersList.get('X-Forwarded-Path')?.split('?')[0];  // Working only with Nginx config!
    if (!path) return;
    const object = (meta as { [key: string]: any });
    const base = meta.base;
    const extend = object[path];
    return merge({}, base, extend) as Metadata;
}

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
    return (
        <CookiesProvider>
            <Providers>
                {children}
            </Providers>
        </CookiesProvider>
    );
}
