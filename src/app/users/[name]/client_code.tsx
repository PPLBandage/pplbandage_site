'use client';

import { Users } from './page';
import { JSX, useEffect, useState } from 'react';
import styles from '@/app/styles/me/me.module.css';
import style_sidebar from '@/app/styles/me/sidebar.module.css';
import { SimpleGrid } from '@/app/modules/components/AdaptiveGrid';
import { renderSkin } from '@/app/modules/utils/SkinCardRender';

const UsersClient = ({ user }: { user: Users }) => {
    const [elements, setElements] = useState<JSX.Element[]>(null);

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
