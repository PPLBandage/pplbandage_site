'use client';

import { JSX, useEffect, useState } from 'react';
import styles from '@/styles/me/me.module.css';
import { SimpleGrid } from '@/components/workshop/AdaptiveGrid';
import { renderSkin } from '@/lib/SkinCardRender';
import { CreateCard } from '@/components/workshop/Card';
import { getMeWorks } from '@/lib/api/user';
import useSWR from 'swr';

const fetcher = async () => {
    const data = await getMeWorks();
    return data.reverse();
};

const Main = () => {
    const { data } = useSWR('me-works', fetcher);
    const [cards, setCards] = useState<JSX.Element[] | null>(null);

    useEffect(() => {
        if (data) renderSkin(data, styles).then(setCards);
    }, [data]);

    if (cards === null) return null;
    if (cards.length === 0) return <NoBandages />;
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
