'use client';

import style_sidebar from '@/app/styles/me/sidebar.module.css';
import style_add from '@/app/styles/tutorials/common.module.css';
import { usePathname } from 'next/navigation';
import { TransitionLink } from './AnimatedLink';
import { LayoutContent } from './[slug]/types';

const ASide = ({ pages }: { pages: LayoutContent[] }) => {
    const pathname = usePathname();
    const path = pathname.split('/')[pathname.split('/').length - 1];

    const pages_el = pages.map((page, index) => (
        <TransitionLink
            key={index}
            href={`/tutorials/${page.slug}`}
            className={`${style_sidebar.side_butt} ${
                path == page.slug && style_sidebar.active
            }`}
        >
            {page.name}
        </TransitionLink>
    ));
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
            {pages_el}
        </div>
    );
};

export default ASide;
