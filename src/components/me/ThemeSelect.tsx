'use client';

import { useCallback, useRef, useState } from 'react';
import ReactCSSTransition from '@/components/CSSTransition';

import Styles from '@/styles/theme_selector.module.css';
import { IconBucketDroplet, IconPalette, IconPhoto } from '@tabler/icons-react';
import { setUserSetting } from '@/lib/api/user';
import { debounce } from 'lodash';

interface MenuProps {
    initialValue: number;
    initialColor: string;
    onChange(val: number): void;
    onColorChange(val: string): void;
}

const getIcon = (theme: number) => {
    switch (theme) {
        case 1:
            return <IconPhoto width={16} height={16} />;
        case 2:
            return <IconPalette width={16} height={16} />;
        default:
            return <IconBucketDroplet width={16} height={16} />;
    }
};

const Menu = ({
    initialValue,
    initialColor,
    onChange,
    onColorChange
}: MenuProps) => {
    const [expanded, setExpanded] = useState<boolean>(false);
    const colorRef = useRef<HTMLInputElement>(null);

    const [theme, setTheme] = useState<number>(initialValue);
    const [displayTheme, setDisplayTheme] = useState<number>(initialValue);
    const [opacity, setOpacity] = useState<number>(1);
    const timeoutRef = useRef<NodeJS.Timeout>(null);

    const themeChanged = (_theme: number) => {
        if (_theme === theme) return;
        if (timeoutRef.current) clearTimeout(timeoutRef.current);
        setOpacity(0);

        onChange(_theme);
        setTheme(_theme);
        setUserSetting({ profile_theme: _theme }).catch(console.error);
        timeoutRef.current = setTimeout(() => {
            setDisplayTheme(_theme);
            setOpacity(1);
        }, 200);
    };

    const handleColorOpen = () => {
        if (colorRef.current) {
            colorRef.current.click();
        }
    };

    const debouncedHandleColorChange = useCallback(
        debounce(event => {
            onColorChange(event.target.value);
        }, 5),
        []
    );

    const debouncedHandleColorSave = useCallback(
        debounce(event => {
            setUserSetting({ theme_color: event.target.value });
        }, 750),
        []
    );

    return (
        <div className={Styles.main}>
            <button
                className={Styles.style_change}
                onClick={() => setExpanded(_prev => !_prev)}
            >
                <div className={Styles.icon_container} style={{ opacity }}>
                    {getIcon(displayTheme)}
                </div>
            </button>
            <ReactCSSTransition
                state={expanded}
                timeout={150}
                classNames={{
                    enter: Styles.menu_enter,
                    exitActive: Styles.menu_exit_active
                }}
            >
                <div className={Styles.menu}>
                    <button
                        className={`${theme === 0 && Styles.enabled}`}
                        onClick={() => themeChanged(0)}
                    >
                        {getIcon(0)}
                    </button>
                    <button
                        className={`${theme === 1 && Styles.enabled}`}
                        onClick={() => themeChanged(1)}
                    >
                        {getIcon(1)}
                    </button>

                    <button
                        style={{ position: 'relative' }}
                        className={`${theme === 2 && Styles.enabled}`}
                        onClick={() => {
                            themeChanged(2);
                            handleColorOpen();
                        }}
                    >
                        <input
                            type="color"
                            className={Styles.color_input}
                            ref={colorRef}
                            defaultValue={initialColor}
                            onChange={e => {
                                debouncedHandleColorChange(e);
                                debouncedHandleColorSave(e);
                            }}
                        />
                        {getIcon(2)}
                    </button>
                </div>
            </ReactCSSTransition>
        </div>
    );
};

export default Menu;
