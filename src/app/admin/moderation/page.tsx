'use client';

import useAccess from '@/lib/useAccess';
import { notFound } from 'next/navigation';
import style_root from '@/styles/admin/page.module.css';
import { JSX, useEffect, useState } from 'react';
import { Bandage } from '@/types/global';
import { renderSkin } from '@/lib/SkinCardRender';
import styles_card from '@/styles/me/me.module.css';
import { getUnderModerationBandages } from '@/lib/apiManager';
import { SimpleGrid } from '@/components/workshop/AdaptiveGrid';

const ModerationBandages = () => {
    const [elements, setElements] = useState<JSX.Element[]>([]);

    const render_skins = (data: Bandage[]) => {
        renderSkin(data, styles_card).then(setElements);
    };

    useEffect(() => {
        getUnderModerationBandages().then(render_skins).catch(console.error);
    }, []);

    return (
        <div
            className={style_root.users_container}
            style={{ marginBottom: '1rem' }}
        >
            <h2 style={{ margin: 0 }}>Повязки на модерации</h2>
            <SimpleGrid>{elements}</SimpleGrid>
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
