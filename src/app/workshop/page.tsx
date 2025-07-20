/* eslint-disable @typescript-eslint/no-unused-expressions */
'use client';

import React, { JSX } from 'react';
import { useEffect, useState } from 'react';
import Style from '@/styles/workshop/page.module.css';

import { Paginator } from '@/components/workshop/Paginator';
import { Search } from '@/components/workshop/Search';
import { BandageResponse } from '@/types/global.d';
import Image from 'next/image';
import styles_card from '@/styles/me/me.module.css';
import IconSvg from '@/resources/icon.svg';
import {
    BrowserNotification,
    calcChecksum
} from '@/components/workshop/checkBrowserAPI';
import { renderSkin } from '@/lib/SkinCardRender';
import { SimpleGrid } from '@/components/workshop/AdaptiveGrid';
import { ConfigContext, ConfigInterface } from '@/lib/ConfigContext';
import { getCookie, setCookie } from 'cookies-next';
import { constrain } from '@/lib/textUtils';
import { getWorkshop } from '@/lib/api/workshop';

export default function Home() {
    const [data, setData] = useState<BandageResponse>(null);
    const [elements, setElements] = useState<JSX.Element[]>(null);
    const [totalCount, setTotalCount] = useState<number>(0);
    const [page, setPage] = useState<number>(0);
    const [take, setTake] = useState<number>(12);
    const [search, setSearch] = useState<string>('');
    const [firstLoaded, setFirstLoaded] = useState<boolean>(false);
    const [lastConfig, setLastConfig] = useState(null);
    const [scroll, setScroll] = useState<number>(0);

    const [sort, setSort] = useState<string>('relevant_up');
    const [alertShown, setAlertShown] = useState<boolean>(false);

    useEffect(() => {
        const workshopState = window.sessionStorage.getItem('workshopState');
        if (workshopState) {
            window.sessionStorage.removeItem('workshopState');

            const data = JSON.parse(workshopState) as ConfigInterface;
            data.page && setPage(data.page);
            data.totalCount && setTotalCount(data.totalCount);
            data.take && setTake(data.take);
            data.search && setSearch(data.search);
            data.sort && setSort(data.sort);
            data.scroll && setScroll(data.scroll);
        }

        setFirstLoaded(true);
    }, []);

    useEffect(() => {
        if (!firstLoaded) return;

        const config = {
            page: constrain(page, 0, Math.ceil(totalCount / take)),
            take: take,
            search: search || undefined,
            sort: sort || undefined
        };
        if (JSON.stringify(config) === JSON.stringify(lastConfig)) {
            return;
        }

        getWorkshop(config)
            .then(data => {
                setData(data);
                setTotalCount(data.totalCount);
            })
            .catch(console.error);

        setLastConfig(config);
    }, [page, search, take, sort, firstLoaded]);

    useEffect(() => {
        if (!getCookie('warningAccepted')) {
            calcChecksum().then(result => !result && setAlertShown(true));
        }
        data && renderSkin(data.data, styles_card).then(setElements);
    }, [data]);

    useEffect(() => {
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
    }, [page]);

    useEffect(() => {
        if (elements && elements.length > 0 && scroll > 0) {
            setScroll(0);
            window.scrollTo({
                top: scroll,
                behavior: 'smooth'
            });
        }
    }, [elements]);

    return (
        <ConfigContext.Provider
            value={{ lastConfig: { ...lastConfig, totalCount } }}
        >
            <BrowserNotification
                expanded={alertShown}
                onClose={() => {
                    setCookie('warningAccepted', 'true', {
                        maxAge: 60 * 24 * 14
                    });
                    setAlertShown(false);
                }}
            />
            <main className={Style.main}>
                <div className={Style.center}>
                    <Search
                        sort={sort}
                        take={take}
                        search={search}
                        onSearch={setSearch}
                        onChangeTake={setTake}
                        onChangeSort={setSort}
                    />

                    <Paginator
                        total_count={totalCount}
                        take={take}
                        onChange={setPage}
                        page={page}
                    />

                    <div
                        className={Style.animated}
                        style={{
                            opacity: elements ? '1' : '0',
                            transform: elements
                                ? 'translateY(0)'
                                : 'translateY(50px)'
                        }}
                    >
                        <SimpleGrid>{elements}</SimpleGrid>
                    </div>

                    {(!elements || elements.length === 0) && (
                        <TheresNothingHere elements={elements} />
                    )}

                    {elements && elements.length > 0 && totalCount > take && (
                        <Paginator
                            total_count={totalCount}
                            take={take}
                            onChange={setPage}
                            page={page}
                        />
                    )}
                </div>
            </main>
        </ConfigContext.Provider>
    );
}

const TheresNothingHere = ({ elements }: { elements: JSX.Element[] }) => {
    return (
        <>
            {elements && elements.length === 0 ? (
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
            ) : (
                <IconSvg width={86} height={86} className={Style.loading} />
            )}
        </>
    );
};
