'use client';

import styles from '@/styles/me/me.module.css';
import { SimpleGrid } from '@/components/workshop/AdaptiveGrid';
import { Card, CreateCard } from '@/components/workshop/Card';
import { getMeWorks } from '@/lib/api/user';
import useSWR from 'swr';

const fetcher = async () => {
    const data = await getMeWorks();
    return data.reverse();
};

const Main = () => {
    const { data } = useSWR('me-works', fetcher);

    if (data == undefined) return null;
    if (data.length === 0) return <NoBandages />;

    const cards = data.map((bandage, i) => (
        <Card key={i} el={bandage} className={styles} />
    ));
    return (
        <div className={styles.cont}>
            <SimpleGrid>{[<CreateCard key="create" />, ...cards]}</SimpleGrid>
        </div>
    );
};

const NoBandages = () => {
    return (
        <div className={styles.cont}>
            <CreateCard key="create" first />
        </div>
    );
};

export default Main;
