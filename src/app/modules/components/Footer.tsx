'use client';

import { setTheme } from '@/app/me/settings/setTheme';
import style from '@/app/styles/footer.module.css';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useEffect, useState } from 'react';
import themes from '@/app/themes';
import { useCookiesServer } from 'use-next-cookie';

const getYearByTimeZone = (timeZone: string) => {
    return new Intl.DateTimeFormat('en-US', {
        year: 'numeric',
        timeZone
    }).format(new Date());
};

const Footer = () => {
    const path = usePathname();
    const cookiesServer = useCookiesServer();
    const themesKeys = Object.keys(themes);
    const initialThemeIndex = themesKeys.indexOf(
        cookiesServer.get('theme_main') || 'default'
    );
    const [theme, setTheme_] = useState<number>(
        initialThemeIndex !== -1 ? initialThemeIndex : 0
    );

    useEffect(() => {
        if (theme > themesKeys.length - 1) {
            setTheme_(0);
            return;
        }

        setTheme(themesKeys[theme]);
    }, [theme]);

    if (path === '/') return null;

    return (
        <footer
            className={style.footer}
            style={{
                marginLeft: '1rem',
                marginRight: '1rem',
                position: 'relative',
                zIndex: 1
            }}
        >
            <div className={style.container}>
                <div className={style.links}>
                    <div className={style.links_cont}>
                        <Link href="/tutorials/rules">Правила сайта</Link>
                        <Link href="/contacts">Контакты</Link>

                        <Link href="/tutorials">Туториалы</Link>
                        <Link
                            href="https://github.com/PPLBandage"
                            target="_blank"
                        >
                            GitHub
                        </Link>
                        <a
                            className={style.theme_switcher}
                            onClick={() => setTheme_(prev => prev + 1)}
                        >
                            Изменить тему
                        </a>
                    </div>
                </div>
                <p className={style.project}>
                    PPLBandage project 2023–{getYearByTimeZone('Etc/GMT-3')} by
                    AndcoolSystems,&nbsp;
                    <span>
                        master@
                        <a
                            className={style.git}
                            // eslint-disable-next-line max-len
                            href={`https://github.com/PPLBandage/pplbandage_site/commit/${process.env.NEXT_PUBLIC_COMMIT_SHA}`}
                        >
                            {process.env.NEXT_PUBLIC_COMMIT_SHA.slice(0, 7)}
                        </a>
                    </span>
                </p>
                <p style={{ fontSize: '.8rem', margin: 0, marginTop: '.5rem' }}>
                    NOT AN OFFICIAL MINECRAFT SERVICE. NOT APPROVED BY OR
                    ASSOCIATED WITH MOJANG OR MICROSOFT.
                </p>
            </div>
        </footer>
    );
};

export default Footer;
