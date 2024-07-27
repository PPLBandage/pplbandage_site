'use client';

import { useEffect, useState } from 'react';
import { CSSTransition } from 'react-transition-group';
import Styles from '@/app/styles/theme_selector.module.css';
import Image from 'next/image';

interface MenuProps {
    initialValue?: number;
    color_available?: boolean;
    onChange(val: number): void
}

const getIcon = (theme: number) => {
    switch (theme) {
        case 1:
            return "/static/icons/scenery.svg";
        case 2:
            return "/static/icons/color-palette.svg";
        default:
            return "/static/icons/fill.svg";
    }
}

const Menu = ({ initialValue, color_available, onChange }: MenuProps) => {
    const [expanded, setExpanded] = useState<boolean>(false);
    const [theme, setTheme] = useState<number>(initialValue);

    useEffect(() => {
        onChange(theme);
    }, [theme]);


    return (<div className={Styles.main}>
        <button className={Styles.style_change} onClick={() => setExpanded(_prev => !_prev)}>
            <Image src={getIcon(theme)} alt="" width={16} height={16} />
        </button>
        <CSSTransition
            in={expanded}
            timeout={150}
            classNames={{
                enter: Styles['menu-enter'],
                enterActive: Styles['menu-enter-active'],
                exit: Styles['menu-exit'],
                exitActive: Styles['menu-exit-active'],
            }}
            unmountOnExit>
            <div className={Styles.menu}>
                <button className={theme === 0 && Styles.enabled} onClick={() => setTheme(0)}><Image src="/static/icons/fill.svg" alt="" width={16} height={16} /></button>
                <button className={theme === 1 && Styles.enabled} onClick={() => setTheme(1)}><Image src="/static/icons/scenery.svg" alt="" width={16} height={16} /></button>
                {color_available && <button className={theme === 2 && Styles.enabled} onClick={() => setTheme(2)}><Image src="/static/icons/color-palette.svg" alt="" width={16} height={16} /></button>}
            </div>
        </CSSTransition>
    </div>);
}

export default Menu;