"use client";

import React from "react";
import { useEffect, useState } from "react";
import Header from "@/app/modules/components/header.module";
import Style from "@/app/styles/workshop/page.module.css";

import { Paginator } from "@/app/modules/components/paginator.module";
import { Search } from "@/app/modules/components/search.module";
import { BandageResponse, Category } from "@/app/interfaces";
import { constrain } from "@/app/modules/components/card.module";
import Footer from "@/app/modules/components/footer.module";
import Image from "next/image";
import styles_card from "@/app/styles/me/me.module.css";
import IconSvg from '@/app/resources/icon.svg';
import { BrowserNotification, calcChecksum } from "./checkBrowserAPI.module";
import { useCookies } from "next-client-cookies";
import { renderSkin } from "../modules/utils/skinCardRender.module";
import { SimpleGrid } from "../modules/components/adaptiveGrid.module";
import ApiManager from "../modules/utils/apiManager";


export default function Home() {
    const cookies = useCookies();
    const [data, setData] = useState<BandageResponse>(null);
    const [elements, setElements] = useState<JSX.Element[]>(null);
    const [totalCount, setTotalCount] = useState<number>(0);
    const [page, setPage] = useState<number>(0);
    const [take, setTake] = useState<number>(12);
    const [search, setSearch] = useState<string>('');

    const [lastConfig, setLastConfig] = useState(null);
    const [categories, setCategories] = useState<Category[]>([]);

    const [filters, setFilters] = useState<Category[]>([]);
    const [sort, setSort] = useState<string>('popular_up');
    const [alertShown, setAlertShown] = useState<boolean>(false);


    useEffect(() => {
        ApiManager.getCategories().then(setCategories);
    }, [])


    useEffect(() => {
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

        ApiManager.getWorkshop(config).then(data => {
            setData(data);
            setTotalCount(data.totalCount);
        });

        setLastConfig(config);
    }, [page, search, take, filters, sort])


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
    }, [page])

    return (
        <body>
            <BrowserNotification
                expanded={alertShown}
                onClose={() => {
                    cookies.set('warningAccepted', 'true');
                    setAlertShown(false);
                }}
            />
            <Header />
            <main className={Style.main}>
                <div className={Style.center}>
                    <Search
                        search={search}
                        onSearch={setSearch}
                        onChangeTake={setTake}
                        categories={categories}
                        onChangeSort={setSort}
                        onChangeFilters={setFilters}
                    />
                    {elements && elements.length > 0 &&
                        <Paginator total_count={totalCount} take={take} onChange={setPage} page={page} />}
                    {elements && elements.length > 0 ?
                        <SimpleGrid>{elements}</SimpleGrid> :
                        <TheresNothingHere elements={elements} />
                    }
                    {elements && elements.length > 0 &&
                        <Paginator total_count={totalCount} take={take} onChange={setPage} page={page} />}
                </div>
                <Footer />
            </main>
        </body>
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