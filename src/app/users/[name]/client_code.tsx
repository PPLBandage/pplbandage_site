'use client';

import { JSX, useEffect, useState } from 'react';
import styles from '@/styles/me/me.module.css';
import style_sidebar from '@/styles/me/sidebar.module.css';
import { SimpleGrid } from '@/components/workshop/AdaptiveGrid';
import { renderSkin } from '@/lib/SkinCardRender';
import { Users } from '@/types/global';

const UsersClient = ({ user }: { user: Users }) => {
    const [elements, setElements] = useState<JSX.Element[] | null>(null);

    useEffect(() => {
        renderSkin(user.works.reverse(), styles).then(setElements);
    }, []);

    if (!elements || elements.length === 0) return null;
    return (
        <div className={`${styles.cont} ${style_sidebar.hidable}`}>
            <SimpleGrid>{elements}</SimpleGrid>
        </div>
    );
};

export default UsersClient;
