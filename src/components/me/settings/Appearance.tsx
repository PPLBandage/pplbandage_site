import { useEffect, useRef, useState } from 'react';
import { useNextCookie } from 'use-next-cookie';
import { setTheme, toggleTheme } from '@/lib/setTheme';
import Style from '@/styles/me/connections.module.css';
import themes from '@/constants/themes';
import { IconPalette } from '@tabler/icons-react';
import Style_themes from '@/styles/me/themes.module.css';
import SlideButton from '@/components/SlideButton';
import { setCookie } from 'cookies-next';

const maxAge = 60 * 24 * 365 * 10;
export const Appearance = () => {
    const themeCookie = useNextCookie('theme_main', 1000);
    const useFlipRenders = useNextCookie('use-flip-renders') === 'true';
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
        <div className={Style.container}>
            <h3>
                <IconPalette />
                Внешний вид
            </h3>
            <div className={Style_themes.parent}>{themesEl}</div>
            <SlideButton
                defaultValue={useFlipRenders}
                onChange={async state => {
                    return setCookie('use-flip-renders', state, { maxAge });
                }}
                loadable
                label="Использовать 3D карточки повязок в мастерской"
            />
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
    const inputRef = useRef<HTMLInputElement>(null);

    const changeTheme = () => {
        if (!inputRef.current) return;
        if (theme === data.name) return;

        const { left, top, width, height } =
            inputRef.current.getBoundingClientRect();
        toggleTheme(
            left + width / 2,
            top + height / 2,
            data.name,
            (name: string) => {
                setTheme(name);
                onChange(name);
            }
        );
    };

    return (
        <div
            onClick={changeTheme}
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
                    ref={inputRef}
                    type="radio"
                    name="theme"
                    id={data.name}
                    checked={theme === data.name}
                    onChange={() => {}}
                    onClick={e => {
                        e.stopPropagation();
                        changeTheme();
                    }}
                />
                <label htmlFor={data.name} onClick={e => e.stopPropagation()}>
                    {data.title}
                </label>
            </div>
        </div>
    );
};
