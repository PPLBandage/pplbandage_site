'use client';

import style_sidebar from '@/styles/me/sidebar.module.css';
import style_add from '@/styles/tutorials/common.module.css';
import { usePathname } from 'next/navigation';
import { TransitionLink } from '@/components/tutorials/AnimatedLink';
import {
    IconBandage,
    IconGavel,
    IconPalette,
    IconSmartHome
} from '@tabler/icons-react';

const ASide = () => {
    const pathname = usePathname();
    const path = pathname.split('/')[pathname.split('/').length - 1];
    return (
        <div
            className={`${style_sidebar.card} ${style_add.side_card}`}
            style={{ borderRadius: '10px' }}
        >
            <TransitionLink
                href="/tutorials"
                className={`${style_sidebar.side_butt} ${
                    path == 'tutorials' && style_sidebar.active
                }`}
            >
                <IconSmartHome />
                Главная
            </TransitionLink>
            <TransitionLink
                href="/tutorials/bandage"
                className={`${style_sidebar.side_butt} ${
                    path == 'bandage' && style_sidebar.active
                }`}
            >
                <IconBandage />
                Создание повязки
            </TransitionLink>
            <TransitionLink
                href="/tutorials/colorable"
                className={`${style_sidebar.side_butt} ${
                    path == 'colorable' && style_sidebar.active
                }`}
            >
                <IconPalette />
                Окрашиваемые повязки
            </TransitionLink>
            <TransitionLink
                href="/tutorials/rules"
                className={`${style_sidebar.side_butt} ${
                    path == 'rules' && style_sidebar.active
                }`}
            >
                <IconGavel />
                Правила сайта
            </TransitionLink>
        </div>
    );
};

export default ASide;
