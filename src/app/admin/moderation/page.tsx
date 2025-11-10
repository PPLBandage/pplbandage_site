'use client';

import useAccess from '@/lib/useAccess';
import { notFound } from 'next/navigation';
import style_root from '@/styles/admin/page.module.css';
import styles_card from '@/styles/me/me.module.css';
import { SimpleGrid } from '@/components/workshop/AdaptiveGrid';
import { getUnderModerationBandages } from '@/lib/api/workshop';
import useSWR from 'swr';
import { Card } from '@/components/workshop/Card';

const ModerationBandages = () => {
    const { data } = useSWR(
        'moderationBandages',
        async () => await getUnderModerationBandages()
    );

    if (!data) return null;

    const cards = data.map((bandage, i) => (
        <Card key={i} el={bandage} className={styles_card} />
    ));
    return (
        <div className={style_root.users_container} style={{ marginBottom: '1rem' }}>
            <h2 style={{ margin: 0 }}>Повязки на модерации</h2>
            <SimpleGrid>{cards}</SimpleGrid>
        </div>
    );
};

const Page = () => {
    const access = useAccess();
    if (!access.length) {
        notFound();
    }

    const superAdmin = access.includes(5);
    if (!superAdmin && !access.includes(1)) {
        notFound();
    }

    return (
        <main className={style_root.main}>
            <div className={style_root.main_container}>
                <ModerationBandages />
            </div>
        </main>
    );
};

export default Page;
