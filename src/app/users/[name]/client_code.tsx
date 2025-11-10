'use client';

import styles from '@/styles/me/me.module.css';
import style_sidebar from '@/styles/me/sidebar.module.css';
import { SimpleGrid } from '@/components/workshop/AdaptiveGrid';
import { Users } from '@/types/global';
import { Card } from '@/components/workshop/Card';

const UsersClient = ({ user }: { user: Users }) => {
    if (user.works.length === 0) return null;

    const cards = user.works.map((bandage, i) => (
        <Card key={i} el={bandage} className={styles} />
    ));
    return (
        <div className={`${styles.cont} ${style_sidebar.hidable}`}>
            <SimpleGrid>{cards}</SimpleGrid>
        </div>
    );
};

export default UsersClient;
