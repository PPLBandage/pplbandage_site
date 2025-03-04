'use client';

import { setTheme } from '@/app/me/settings/setTheme';
import style from '@/app/styles/footer.module.css';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useEffect, useState } from 'react';
import themes from '@/app/themes';
import { useCookiesServer } from 'use-next-cookie';
import {
    IconAddressBook,
    IconBrandGithub,
    IconPalette
} from '@tabler/icons-react';

import IconPepe from '@/app/resources/icon.svg';
import { UseGlobalTooltip } from './Tooltip';

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
            style={{
                marginLeft: '1rem',
                marginRight: '1rem',
                position: 'relative',
                zIndex: 1
            }}
        >
            <div className={style.container}>
                <div className={style.project_name}>
                    <IconPepe width={32} height={32} />
                    <p className={style.project}>PPLBandage project</p>
                </div>
                <p className={style.project}>
                    2023–{getYearByTimeZone('Etc/GMT-3')} by AndcoolSystems
                </p>
                <div className={style.links_cont}>
                    <Link href="/contacts">
                        <UseGlobalTooltip text="Контакты">
                            <IconAddressBook />
                        </UseGlobalTooltip>
                    </Link>
                    <hr />
                    <Link href="https://github.com/PPLBandage" target="_blank">
                        <UseGlobalTooltip text="GitHub">
                            <IconBrandGithub />
                        </UseGlobalTooltip>
                    </Link>
                    <hr />
                    <button
                        className={style.theme_switcher}
                        onClick={() => setTheme_(prev => prev + 1)}
                    >
                        <UseGlobalTooltip text="Сменить тему">
                            <IconPalette />
                        </UseGlobalTooltip>
                    </button>
                </div>
            </div>
        </footer>
    );
};

export default Footer;
