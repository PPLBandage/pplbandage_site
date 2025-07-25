'use client';

import '@/styles/404/style.css';
import style from '@/styles/404/page.module.css';
import { IconReload } from '@tabler/icons-react';
import { getTheme } from '../components/root/providers';
import { getCookie } from 'cookies-next/client';
import { CSSProperties, useEffect } from 'react';
import { Inter } from 'next/font/google';
import { usePathname } from 'next/navigation';

const inter = Inter({ subsets: ['latin'] });

type GlobalErrorProps = {
    error: Error & { digest?: string };
    reset: () => void;
};

export default function GlobalError({ error }: GlobalErrorProps) {
    const theme = getTheme(getCookie('theme_main') || 'amoled');
    const path = usePathname();

    useEffect(() => {
        const content = `Page: ${path}\nMessage: ${error.message ?? 'No message'}`;
        fetch('/api/v1/error-report', {
            body: JSON.stringify({ content }),
            method: 'POST',
            headers: { 'content-type': 'application/json' }
        }).then(() => console.info('System has been reported about your issue'));
    }, []);

    return (
        <html
            style={theme.data as CSSProperties}
            lang="ru"
            className={inter.className}
        >
            <body>
                <div className={style.body}>
                    <div className={style.circle}></div>
                    <div className={`${style.circle} ${style.circle_2}`}></div>
                    <main className={style.main}>
                        <h2 style={{ fontSize: '2rem' }}>Client Error</h2>
                        <h3 style={{ margin: '.78rem' }}>
                            Произошла ошибка на стороне клиента ({error.message})
                        </h3>
                        <div>
                            <button
                                className={style.link}
                                onClick={() => window.location.reload()}
                            >
                                <IconReload />
                                Попробовать снова
                            </button>
                        </div>
                    </main>
                </div>
            </body>
        </html>
    );
}
