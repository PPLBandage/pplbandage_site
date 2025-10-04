import { useCallback, useEffect, useState } from 'react';
import { useNextCookie } from 'use-next-cookie';
import { setTheme } from '@/lib/setTheme';
import Style from '@/styles/me/connections.module.css';
import themes from '@/constants/themes';
import { IconPalette } from '@tabler/icons-react';
import Style_themes from '@/styles/me/themes.module.css';
import { flushSync } from 'react-dom';

export const Themes = () => {
    const themeCookie = useNextCookie('theme_main', 1000);
    const [themeState, setThemeState] = useState<string>(themeCookie || 'amoled');

    useEffect(() => setThemeState(themeCookie ?? 'amoled'), [themeCookie]);

    const change_theme = (name: string) => {
        setThemeState(name);
    };

    const themesEl = Object.entries(themes).map(entry => (
        <Theme
            key={entry[0]}
            data={{
                name: entry[0],
                title: entry[1].title,
                ...entry[1].data
            }}
            theme={themeState}
            onChange={change_theme}
        />
    ));

    return (
        <div
            className={Style.container}
            style={{ paddingBottom: 'calc(1rem - 10px)' }}
        >
            <h3>
                <IconPalette />
                Внешний вид
            </h3>
            <div className={Style_themes.parent}>{themesEl}</div>
        </div>
    );
};

type ThemeProps = {
    name: string;
    title: string;
    '--main-bg-color': string;
    '--main-card-color': string;
    '--main-element-color': string;
};

const Theme = ({
    data,
    theme,
    onChange
}: {
    data: ThemeProps;
    theme: string;
    onChange(val: string): void;
}) => {
    const changeTheme = (name: string) => {
        setTheme(name);
        onChange(name);
    };

    const toggleTheme = useCallback(async (x: number, y: number) => {
        if (!('startViewTransition' in document)) {
            changeTheme(data.name);
            return;
        }

        await document.startViewTransition(() => {
            flushSync(() => {
                changeTheme(data.name);
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

    return (
        <div
            onClick={evt => {
                toggleTheme(evt.clientX, evt.clientY);
            }}
            style={{ cursor: 'pointer' }}
            className={Style_themes.clickable}
        >
            <div
                style={{ backgroundColor: data['--main-bg-color'] }}
                className={Style_themes.background}
            >
                <div
                    style={{ backgroundColor: data['--main-card-color'] }}
                    className={Style_themes.card}
                >
                    <div
                        style={{
                            backgroundColor: data['--main-element-color']
                        }}
                        className={Style_themes.icon}
                    />
                    <div className={Style_themes.text_container}>
                        <div
                            style={{
                                backgroundColor: data['--main-element-color'],
                                width: '80%'
                            }}
                        />
                        <div
                            style={{
                                backgroundColor: data['--main-element-color']
                            }}
                        />
                    </div>
                </div>
            </div>
            <div className={Style_themes.footer}>
                <input
                    type="radio"
                    name="theme"
                    id={data.name}
                    checked={theme === data.name}
                    onChange={() => {}}
                    onClick={e => {
                        e.stopPropagation();
                        toggleTheme(e.clientX, e.clientY);
                    }}
                />
                <label htmlFor={data.name} onClick={e => e.stopPropagation()}>
                    {data.title}
                </label>
            </div>
        </div>
    );
};
