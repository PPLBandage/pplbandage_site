/* eslint-disable @typescript-eslint/no-unused-expressions */
'use client';

import React, { JSX } from 'react';
import { useEffect, useState } from 'react';
import Style from '@/styles/workshop/page.module.css';

import { Paginator } from '@/components/Paginator';
import { Search } from '@/components/Search';
import { BandageResponse, Category } from '@/types/global.d';
import { constrain } from '@/components/Card';
import Image from 'next/image';
import styles_card from '@/styles/me/me.module.css';
import IconSvg from '@/resources/icon.svg';
import { BrowserNotification, calcChecksum } from './checkBrowserAPI';
import { renderSkin } from '@/lib/SkinCardRender';
import { SimpleGrid } from '@/components/AdaptiveGrid';
import ApiManager from '@/lib/apiManager';
import { ConfigContext, ConfigInterface } from '@/lib/ConfigContext';
import { getCookie, setCookie } from 'cookies-next';

export default function Home() {
    const [data, setData] = useState<BandageResponse>(null);
    const [elements, setElements] = useState<JSX.Element[]>(null);
    const [totalCount, setTotalCount] = useState<number>(0);
    const [page, setPage] = useState<number>(0);
    const [take, setTake] = useState<number>(12);
    const [search, setSearch] = useState<string>('');
    const [firstLoaded, setFirstLoaded] = useState<boolean>(false);

    const [lastConfig, setLastConfig] = useState(null);
    const [categories, setCategories] = useState<Category[]>([]);

    const [filters, setFilters] = useState<Category[]>([]); // Temp state for search callback
    const [scroll, setScroll] = useState<number>(0);

    const [sort, setSort] = useState<string>('relevant_up');
    const [alertShown, setAlertShown] = useState<boolean>(false);

    useEffect(() => {
        const workshopState = window.sessionStorage.getItem('workshopState');
        ApiManager.getCategories()
            .then(categories => {
                if (workshopState) {
                    window.sessionStorage.removeItem('workshopState');

                    const data = JSON.parse(workshopState) as ConfigInterface;
                    data.page && setPage(data.page);
                    data.totalCount && setTotalCount(data.totalCount);
                    data.take && setTake(data.take);
                    data.search && setSearch(data.search);
                    data.sort && setSort(data.sort);
                    data.scroll && setScroll(data.scroll);

                    let _categories = categories;
                    if (data.filters) {
                        const initial_filters = data.filters
                            .split(',')
                            .map(Number);
                        _categories = categories.map(i => {
                            if (initial_filters.includes(i.id))
                                i.enabled = true;
                            return i;
                        });
                    }
                    setFilters(_categories);
                    setCategories(_categories);
                } else {
                    setCategories(categories);
                    setFilters(categories);
                }

                setFirstLoaded(true);
            })
            .catch(console.error);

        if (!workshopState) {
            setFirstLoaded(true);
        }
    }, []);

    useEffect(() => {
        if (!firstLoaded) return;

        const filters_str = filters
            .filter(filter => filter.enabled)
            .map(filter => filter.id)
            .toString();
        const config = {
            page: constrain(page, 0, Math.ceil(totalCount / take)),
            take: take,
            search: search || undefined,
            filters: filters_str || undefined,
            sort: sort || undefined
        };
        if (JSON.stringify(config) === JSON.stringify(lastConfig)) {
            return;
        }

        ApiManager.getWorkshop(config)
            .then(data => {
                setData(data);
                setTotalCount(data.totalCount);
            })
            .catch(console.error);

        setLastConfig(config);
    }, [page, search, take, filters, sort, firstLoaded]);

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
                        categories={categories}
                        onSearch={setSearch}
                        onChangeTake={setTake}
                        onChangeSort={setSort}
                        onChangeFilters={setFilters}
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
