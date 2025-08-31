'use client';

import { setTheme } from '@/lib/setTheme';
import style from '@/styles/footer.module.css';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useEffect, useState } from 'react';
import themes from '@/constants/themes';
import { useCookiesServer } from 'use-next-cookie';
import { IconAddressBook, IconBrandGithub, IconPalette } from '@tabler/icons-react';

import IconPepe from '@/resources/icon.svg';
import { StaticTooltip } from './Tooltip';
import { MainPageFooter } from './MainPageFooter';

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

    useEffect(() => {
        if (theme > themesKeys.length - 1) {
            setTheme_(0);
            return;
        }

        setTheme(themesKeys[theme]);
    }, [theme]);

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
                        onClick={() => setTheme_(prev => prev + 1)}
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
