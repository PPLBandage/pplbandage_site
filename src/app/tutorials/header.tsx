'use client';

import style_sidebar from '@/app/styles/me/sidebar.module.css';
import style_add from '@/app/styles/tutorials/common.module.css';
import { usePathname } from 'next/navigation';
import { TransitionLink } from './AnimatedLink';

const ASide = () => {
    const pathname = usePathname();
    const path = pathname.split('/')[pathname.split('/').length - 1];
    return (
        <div
            className={`${style_sidebar.card} ${style_add.side_card}`}
            style={{
                alignItems: 'stretch',
                gap: '.5rem',
                flexGrow: 0,
                flexShrink: 0
            }}
        >
            <TransitionLink
                href="/tutorials"
                className={`${style_sidebar.side_butt} ${
                    path == 'tutorials' && style_sidebar.active
                }`}
            >
                Главная
            </TransitionLink>
            <TransitionLink
                href="/tutorials/bandage"
                className={`${style_sidebar.side_butt} ${
                    path == 'bandage' && style_sidebar.active
                }`}
            >
                Создание повязки
            </TransitionLink>
            <TransitionLink
                href="/tutorials/colorable"
                className={`${style_sidebar.side_butt} ${
                    path == 'colorable' && style_sidebar.active
                }`}
            >
                Окрашиваемая повязка
            </TransitionLink>
            <TransitionLink
                href="/tutorials/rules"
                className={`${style_sidebar.side_butt} ${
                    path == 'rules' && style_sidebar.active
                }`}
            >
                Правила сайта
            </TransitionLink>
        </div>
    );
};

export default ASide;
