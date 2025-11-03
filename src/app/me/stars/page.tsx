'use client';

import { useEffect, useState } from 'react';
import style_sidebar from '@/styles/me/sidebar.module.css';
import styles_me from '@/styles/me/me.module.css';
import { SimpleGrid } from '@/components/workshop/AdaptiveGrid';
import { Placeholder } from '@/components/me/Placeholder';
import { getMeStars } from '@/lib/api/user';
import { BottomPaginator } from '@/components/workshop/BottomPaginator';
import useSWR from 'swr';
import { Card } from '@/components/workshop/Card';

const Main = () => {
    const [page, setPage] = useState<number>(0);
    const [totalCount, setTotalCount] = useState<number>(0);

    const { data } = useSWR(
        `me-stars:${page}`,
        async () => await getMeStars({ page, take: 12 }),
        { keepPreviousData: true }
    );

    useEffect(() => {
        if (data) setTotalCount(data.totalCount);
        window.scrollTo({ top: 0, behavior: 'smooth' });
    }, [data]);

    if (data == undefined) return null;
    if (data.data.length === 0) return <Placeholder />;

    const cards = data.data.map((bandage, i) => (
        <Card key={i} el={bandage} className={styles_me} />
    ));
    return (
        <div
            className={`${style_sidebar.skins_container_2} ${style_sidebar.hidable}`}
        >
            <BottomPaginator
                total_count={totalCount}
                take={12}
                page={page}
                onChange={setPage}
                elements={data.data}
            />

            <SimpleGrid>{cards}</SimpleGrid>

            <BottomPaginator
                total_count={totalCount}
                take={12}
                page={page}
                onChange={setPage}
                elements={data.data}
            />
        </div>
    );
};

export default Main;
