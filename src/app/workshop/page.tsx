"use client";

import React from "react";
import { useEffect, useState } from "react";
import Style from "@/app/styles/workshop/page.module.css";

import { Paginator } from "@/app/modules/components/Paginator";
import { Search } from "@/app/modules/components/Search";
import { BandageResponse, Category } from "@/app/interfaces";
import { constrain } from "@/app/modules/components/Card";
import Image from "next/image";
import styles_card from "@/app/styles/me/me.module.css";
import IconSvg from '@/app/resources/icon.svg';
import { BrowserNotification, calcChecksum } from "./checkBrowserAPI";
import { useCookies } from "next-client-cookies";
import { renderSkin } from "../modules/utils/SkinCardRender";
import { SimpleGrid } from "../modules/components/AdaptiveGrid";
import ApiManager from "../modules/utils/apiManager";
import { ConfigContext, ConfigInterface } from "../modules/utils/ConfigContext";


export default function Home() {
    const cookies = useCookies();
    const [data, setData] = useState<BandageResponse>(null);
    const [elements, setElements] = useState<JSX.Element[]>(null);
    const [totalCount, setTotalCount] = useState<number>(0);
    const [page, setPage] = useState<number>(0);
    const [take, setTake] = useState<number>(12);
    const [search, setSearch] = useState<string>('');
    const [firstLoaded, setFirstLoaded] = useState<boolean>(false);

    const [lastConfig, setLastConfig] = useState(null);
    const [categories, setCategories] = useState<Category[]>([]);

    const [filters, setFilters] = useState<Category[]>([]);  // Temp state for search callback
    const [scroll, setScroll] = useState<number>(0);

    const [sort, setSort] = useState<string>('relevant_up');
    const [alertShown, setAlertShown] = useState<boolean>(false);


    useEffect(() => {
        const workshopState = window.sessionStorage.getItem('workshopState');
        ApiManager.getCategories().then(categories => {
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
                    const initial_filters = data.filters.split(',').map(Number);
                    _categories = categories.map(i => {
                        if (initial_filters.includes(i.id)) i.enabled = true;
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
        }).catch(console.error);

        if (!workshopState) {
            setFirstLoaded(true);
        }
    }, [])


    useEffect(() => {
        if (!firstLoaded) return;

        const filters_str = filters.filter(filter => filter.enabled).map(filter => filter.id).toString();
        const config = {
            page: constrain(page, 0, Math.ceil(totalCount / take)),
            take: take,
            search: search || undefined,
            filters: filters_str || undefined,
            sort: sort || undefined
        }
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
    }, [page, search, take, filters, sort, firstLoaded])


    useEffect(() => {
        if (!cookies.get('warningAccepted')) {
            calcChecksum().then(result => !result && setAlertShown(true));
        }
        data && renderSkin(data.data, styles_card).then(results => setElements(results));
    }, [data]);

    useEffect(() => {
        window.scrollTo({
            top: 0,
            behavior: "smooth"
        });
    }, [page]);

    useEffect(() => {
        if (elements && elements.length > 0 && scroll > 0) {
            setScroll(0);
            window.scrollTo({
                top: scroll,
                behavior: "smooth"
            });
        }
    }, [elements]);

    return (
        <ConfigContext.Provider value={{ lastConfig: { ...lastConfig, totalCount } }}>
            <BrowserNotification
                expanded={alertShown}
                onClose={() => {
                    cookies.set('warningAccepted', 'true');
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
                        onChangeFilters={setFilters} />

                    <Paginator total_count={totalCount} take={take} onChange={setPage} page={page} />
                    {elements && elements.length > 0 ?
                        <SimpleGrid>{elements}</SimpleGrid> :
                        <TheresNothingHere elements={elements} />
                    }
                    {elements && elements.length > 0 &&
                        <Paginator total_count={totalCount} take={take} onChange={setPage} page={page} />}
                </div>
            </main>
        </ConfigContext.Provider>
    );
}


const TheresNothingHere = ({ elements }: { elements: JSX.Element[] }) => {
    return (
        <>
            {
                elements && elements.length === 0 ?
                    <p style={{
                        display: "flex",
                        alignItems: "center",
                        fontSize: "1.1rem",
                        fontWeight: 500,
                        width: "100%",
                        justifyContent: "center",
                        margin: 0
                    }}>
                        <Image style={{ marginRight: ".5rem" }} src="/static/theres_nothing_here.png" alt="" width={56} height={56} />
                        Похоже, тут ничего нет
                    </p> :
                    <IconSvg width={86} height={86} className={Style.loading} />
            }
        </>
    );
}