'use client';

import React, { JSX, useState } from 'react';
import { useEffect } from 'react';
import Style from '@/styles/workshop/page.module.css';

import { Paginator } from '@/components/workshop/Paginator';
import { Search } from '@/components/workshop/Search';
import Image from 'next/image';
import styles_card from '@/styles/me/me.module.css';
import IconSvg from '@/resources/icon.svg';
import { BrowserNotification } from '@/components/workshop/checkBrowserAPI';
import { renderSkin } from '@/lib/SkinCardRender';
import { SimpleGrid } from '@/components/workshop/AdaptiveGrid';
import { getWorkshop } from '@/lib/api/workshop';
import useSWR from 'swr';
import { useWorkshopStore } from '@/lib/stores/workshop';
import { BottomPaginator } from '@/components/workshop/BottomPaginator';

export default function Home() {
    const [elements, setElements] = useState<JSX.Element[] | null>(null);
    const { page, take, search, sort, totalCount, setPage, setTotalCount } =
        useWorkshopStore();

    const { data } = useSWR(
        `workshop/${page}/${take}/${search}/${sort}`,
        () =>
            getWorkshop({
                page: Math.max(page, 0),
                take,
                search: search || undefined,
                sort: sort || undefined
            }),
        {
            revalidateOnFocus: false,
            keepPreviousData: true
        }
    );

    useEffect(() => {
        if (!data) return;
        renderSkin(data.data, styles_card).then(setElements);
        setTotalCount(data.totalCount);
    }, [data]);

    useEffect(() => {
        window.scrollTo({ top: 0, behavior: 'smooth' });
    }, [page]);

    return (
        <>
            <BrowserNotification />
            <main className={Style.main}>
                <div className={Style.center}>
                    <Search />
                    <Paginator
                        total_count={totalCount}
                        take={take}
                        page={page}
                        onChange={setPage}
                    />

                    <CardsContainer elements={elements} />

                    <BottomPaginator
                        total_count={totalCount}
                        take={take}
                        page={page}
                        onChange={setPage}
                        elements={elements}
                    />
                </div>
            </main>
        </>
    );
}

const CardsContainer = ({ elements }: { elements: JSX.Element[] | null }) => {
    if (elements === null)
        return <IconSvg width={86} height={86} className={Style.loading} />;

    if (elements.length === 0) {
        return (
            <p className={Style.theres_nothing_p}>
                <Image
                    style={{ marginRight: '.5rem' }}
                    src="/static/theres_nothing_here.png"
                    alt=""
                    width={56}
                    height={56}
                />
                Похоже, тут ничего нет
            </p>
        );
    }

    return (
        <div className={Style.animated}>
            <SimpleGrid>{elements}</SimpleGrid>
        </div>
    );
};
