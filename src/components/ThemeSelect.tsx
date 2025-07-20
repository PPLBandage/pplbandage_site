'use client';

import { useRef, useState } from 'react';
import ReactCSSTransition from '@/components/CSSTransition';

import Styles from '@/styles/theme_selector.module.css';
import { IconBucketDroplet, IconPalette, IconPhoto } from '@tabler/icons-react';
import { setUserSetting } from '@/lib/api/user';

interface MenuProps {
    initialValue?: number;
    color_available?: boolean;
    onChange(val: number): void;
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

const Menu = ({ initialValue, color_available, onChange }: MenuProps) => {
    const [expanded, setExpanded] = useState<boolean>(false);

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
                    {color_available && (
                        <button
                            className={`${theme === 2 && Styles.enabled}`}
                            onClick={() => themeChanged(2)}
                        >
                            {getIcon(2)}
                        </button>
                    )}
                </div>
            </ReactCSSTransition>
        </div>
    );
};

export default Menu;
