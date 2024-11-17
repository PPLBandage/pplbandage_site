'use client';

import { useEffect, useState } from 'react';
import { CSSTransition } from 'react-transition-group';
import Styles from '@/app/styles/theme_selector.module.css';
import { IconBucketDroplet, IconPalette, IconPhoto } from '@tabler/icons-react'
import { authApi } from '../utils/api.module';

interface MenuProps {
    initialValue?: number;
    color_available?: boolean;
    onChange(val: number): void
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
}

const Menu = ({ initialValue, color_available, onChange }: MenuProps) => {
    const [expanded, setExpanded] = useState<boolean>(false);
    const [firstLoad, setFirstLoad] = useState<boolean>(true);
    const [theme, setTheme] = useState<number>(initialValue);

    useEffect(() => {
        onChange(theme);
        firstLoad ? setFirstLoad(false) : authApi.put('user/me/theme', { theme: theme });
    }, [theme]);


    return (<div className={Styles.main}>
        <button className={Styles.style_change} onClick={() => setExpanded(_prev => !_prev)}>
            {getIcon(theme)}
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
                <button className={theme === 0 && Styles.enabled} onClick={() => setTheme(0)}>{getIcon(0)}</button>
                <button className={theme === 1 && Styles.enabled} onClick={() => setTheme(1)}>{getIcon(1)}</button>
                {color_available && <button className={theme === 2 && Styles.enabled} onClick={() => setTheme(2)}>{getIcon(2)}</button>}
            </div>
        </CSSTransition>
    </div>);
}

export default Menu;