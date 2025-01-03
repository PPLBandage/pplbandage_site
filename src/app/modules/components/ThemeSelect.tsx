'use client';

import { useEffect, useState } from 'react';
import ReactCSSTransition from '@/app/modules/components/CSSTransition';

import Styles from '@/app/styles/theme_selector.module.css';
import { IconBucketDroplet, IconPalette, IconPhoto } from '@tabler/icons-react'
import ApiManager from '../utils/apiManager';

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
        firstLoad ? setFirstLoad(false) : ApiManager.setTheme({ theme }).catch(console.error);
    }, [theme]);


    return (<div className={Styles.main}>
        <button className={Styles.style_change} onClick={() => setExpanded(_prev => !_prev)}>
            {getIcon(theme)}
        </button>
        <ReactCSSTransition
            state={expanded}
            timeout={150}
            classNames={{
                enter: Styles['menu-enter'],
                exitActive: Styles['menu-exit-active'],
            }}
        >
            <div className={Styles.menu}>
                <button className={theme === 0 && Styles.enabled} onClick={() => setTheme(0)}>{getIcon(0)}</button>
                <button className={theme === 1 && Styles.enabled} onClick={() => setTheme(1)}>{getIcon(1)}</button>
                {color_available && <button className={theme === 2 && Styles.enabled} onClick={() => setTheme(2)}>{getIcon(2)}</button>}
            </div>
        </ReactCSSTransition>
    </div>);
}

export default Menu;