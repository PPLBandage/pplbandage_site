"use client";

import { setTheme } from "@/app/me/settings/setTheme";
import style from "@/app/styles/footer.module.css";
import { useCookies } from "next-client-cookies";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";

const Footer = () => {
    const cookies = useCookies();
    const path = usePathname();
    const themes = ['default', 'amoled'];
    const initialThemeIndex = themes.indexOf(cookies.get('theme_main') || 'default');
    const [theme, setTheme_] = useState<number>(initialThemeIndex !== -1 ? initialThemeIndex : 0);

    useEffect(() => {
        if (theme > themes.length - 1) {
            setTheme_(0);
            return;
        }

        setTheme(themes[theme], cookies);
    }, [theme]);

    if (path === '/') return null;

    return (
        <footer className={style.footer} style={{ marginLeft: '1rem', marginRight: '1rem' }}>
            <div className={style.container}>
                <div className={style.links}>
                    <div className={style.links_cont}>
                        <Link href="/tos">Правила сайта</Link>
                        <Link href="/contacts">Контакты</Link>

                        <Link href="/tutorials">Туториалы</Link>
                        <Link href="https://github.com/PPLBandage" target="_blank">GitHub</Link>
                        <a style={{ cursor: 'pointer', userSelect: 'none' }} onClick={() => setTheme_(prev => prev + 1)}>Изменить тему</a>
                    </div>
                </div>
                <p className={style.beta}>PPLBandage project 2023–{new Date().getFullYear()}, master@<a className={style.git} href={`https://github.com/PPLBandage/pplbandage_site/commit/${process.env.NEXT_PUBLIC_COMMIT_SHA}`}>
                    {process.env.NEXT_PUBLIC_COMMIT_SHA.slice(0, 7)}
                </a></p>
                <p style={{ fontSize: ".8rem", margin: 0, marginTop: ".5rem" }}>NOT AN OFFICIAL MINECRAFT SERVICE. NOT APPROVED BY OR ASSOCIATED WITH MOJANG OR MICROSOFT.</p>
            </div>
        </footer>
    )
}

export default Footer;