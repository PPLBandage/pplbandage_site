'use client';

import { setTheme } from '@/lib/setTheme';
import style from '@/styles/footer.module.css';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useCallback, useState } from 'react';
import themes from '@/constants/themes';
import { useCookiesServer } from 'use-next-cookie';
import { IconAddressBook, IconBrandGithub, IconPalette } from '@tabler/icons-react';

import IconPepe from '@/resources/icon.svg';
import { StaticTooltip } from './Tooltip';
import { MainPageFooter } from './MainPageFooter';
import { flushSync } from 'react-dom';

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
        cookiesServer.get('theme_main') || 'amoled'
    );
    const [theme, setTheme_] = useState<number>(
        initialThemeIndex !== -1 ? initialThemeIndex : 0
    );

    const toggleTheme = useCallback(async (x: number, y: number, theme: string) => {
        if (!('startViewTransition' in document)) {
            setTheme(theme);
            return;
        }

        await document.startViewTransition(() => {
            flushSync(() => {
                setTheme(theme);
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
    }, []);

    if (path === '/') return <MainPageFooter />;

    return (
        <footer className={style.footer}>
            <div className={style.container}>
                <div className={style.project_name}>
                    <Link
                        className={style.icon_container}
                        href="https://pepeland.net"
                    >
                        <IconPepe
                            width={32}
                            height={32}
                            className={style.pepe_icon}
                        />
                    </Link>
                    <p className={style.project}>PPLBandage project</p>
                </div>
                <p className={style.project}>
                    2023–{getYearByTimeZone('Etc/GMT-3')} by AndcoolSystems
                </p>
                <div className={style.links_cont}>
                    <Link href="/contacts">
                        <StaticTooltip title="Контакты">
                            <IconAddressBook />
                        </StaticTooltip>
                    </Link>
                    <hr />
                    <Link href="https://github.com/PPLBandage" target="_blank">
                        <StaticTooltip title="GitHub">
                            <IconBrandGithub />
                        </StaticTooltip>
                    </Link>
                    <hr />
                    <button
                        className={style.theme_switcher}
                        onClick={e => {
                            let _theme = theme + 1;
                            if (_theme > themesKeys.length - 1) _theme = 0;

                            setTheme_(_theme);
                            toggleTheme(e.clientX, e.clientY, themesKeys[_theme]);
                        }}
                    >
                        <StaticTooltip title="Сменить тему">
                            <IconPalette />
                        </StaticTooltip>
                    </button>
                </div>
            </div>
        </footer>
    );
};

export default Footer;
