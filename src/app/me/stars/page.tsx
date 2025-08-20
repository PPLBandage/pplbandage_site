'use client';

import React, { JSX } from 'react';
import { useEffect, useState } from 'react';
import style_sidebar from '@/styles/me/sidebar.module.css';
import styles_me from '@/styles/me/me.module.css';
import { Bandage } from '@/types/global.d';
import { SimpleGrid } from '@/components/workshop/AdaptiveGrid';
import { renderSkin } from '@/lib/SkinCardRender';
import { Placeholder } from '@/components/me/Placeholder';
import { getMeStars } from '@/lib/api/user';
import { BottomPaginator } from '@/components/workshop/BottomPaginator';

const Main = () => {
    const [page, setPage] = useState<number>(0);
    const [totalCount, setTotalCount] = useState<number>(0);
    const [elements, setElements] = useState<JSX.Element[] | null>(null);

    const render_skins = (data: Bandage[]) => {
        renderSkin(data, styles_me).then(setElements);
    };

    useEffect(() => {
        getMeStars({ page, take: 12 })
            .then(response => {
                render_skins(response.data);
                setTotalCount(response.totalCount);
            })
            .catch(console.error);

        window.scrollTo({ top: 0, behavior: 'smooth' });
    }, [page]);

    if (elements === null) return null;
    if (elements.length === 0) return <Placeholder />;

    return (
        <div
            id="sidebar"
            className={`${style_sidebar.skins_container_2} ${style_sidebar.hidable}`}
        >
            <BottomPaginator
                total_count={totalCount}
                take={12}
                page={page}
                onChange={setPage}
                elements={elements}
            />

            <SimpleGrid>{elements}</SimpleGrid>

            <BottomPaginator
                total_count={totalCount}
                take={12}
                page={page}
                onChange={setPage}
                elements={elements}
            />
        </div>
    );
};

export default Main;
