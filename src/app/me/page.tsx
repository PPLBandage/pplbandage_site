'use client';

import { JSX, useEffect, useState } from 'react';
import styles from '@/styles/me/me.module.css';
import { SimpleGrid } from '@/components/AdaptiveGrid';
import { renderSkin } from '@/lib/SkinCardRender';
import ApiManager from '@/lib/apiManager';
import { CreateCard } from '@/components/Card';

const Main = () => {
    const [cards, setCards] = useState<JSX.Element[]>(null);

    useEffect(() => {
        ApiManager.getMeWorks()
            .then(data => renderSkin(data.reverse(), styles).then(setCards))
            .catch(console.error);
    }, []);

    if (cards === null) return null;
    if (cards.length === 0) return <NoBandages />;
    return (
        <div className={styles.cont} id="sidebar">
            <SimpleGrid>{[<CreateCard key="create" />, ...cards]}</SimpleGrid>
        </div>
    );
};

const NoBandages = () => {
    return (
        <div className={styles.cont} id="sidebar">
            <CreateCard key="create" first />
        </div>
    );
};

export default Main;
