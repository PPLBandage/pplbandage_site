import type { Metadata } from 'next';
import Providers from '@/app/modules/providers';
import './styles/layout.css';
import { headers } from 'next/headers';
import meta from '@/app/meta.json';
import { merge } from 'lodash';
import Footer from './modules/components/Footer';
import Header from './modules/components/Header';
import type { Viewport } from 'next';
import { CookieProvider } from './modules/utils/CookiesProvider/CookiesComponent';

export const generateMetadata = async (): Promise<Metadata | undefined> => {
    const headersList = await headers();
    const path = headersList.get('X-Forwarded-Path')?.split('?')[0]; // Working only with Nginx config!
    const object = meta as { [key: string]: unknown };
    const base = meta.base;
    if (!path) return base;
    const extend = object[path];
    return merge({}, base, extend) as Metadata;
};

export const viewport: Viewport = {
    width: 'device-width',
    initialScale: 0.9
};

export default function RootLayout({
    children
}: Readonly<{ children: React.ReactNode }>) {
    return (
        <CookieProvider>
            <Providers>
                <body>
                    <div>
                        <Header />
                        {children}
                    </div>
                    <Footer />
                </body>
            </Providers>
        </CookieProvider>
    );
}
