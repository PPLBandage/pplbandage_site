import type { Metadata } from 'next';
import Providers from '@/components/root/providers';
import '@/styles/layout.css';
import { headers } from 'next/headers';
import meta from '@/app/meta.json';
import { merge } from 'lodash';
import Footer from '@/components/Footer';
import Header from '@/components/Header';
import type { Viewport } from 'next';
import { CookieProvider } from 'use-next-cookie';

export const generateMetadata = async (): Promise<Metadata | undefined> => {
    const headersList = await headers();
    const path = headersList.get('X-Path')?.split('?')[0];
    const object = meta as { [key: string]: unknown };
    const base = meta.base;
    if (!path) return base;
    return merge({}, base, object[path]) as Metadata;
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
