'use client';

import { JSX } from 'react';
import style_workshop from '@/styles/workshop/page.module.css';

export const SimpleGrid = ({
    children
}: {
    children: JSX.Element | JSX.Element[];
}) => {
    return (
        <div className={style_workshop.grid_container}>
            <div className={style_workshop.grid}>{children}</div>
        </div>
    );
};
