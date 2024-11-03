"use client";

import React from "react";
import { useEffect, useState } from "react";
import { SkinViewer } from 'skinview3d';
import Header from "@/app/modules/components/header.module";
import Style from "@/app/styles/workshop/page.module.css";

import axios, { AxiosRequestConfig } from "axios";
import { Paginator } from "@/app/modules/components/paginator.module";
import { Search } from "@/app/modules/components/search.module";
import { Bandage, BandageResponse, Category } from "@/app/interfaces";
import { Card, constrain, generateSkin } from "@/app/modules/components/card.module";
import Footer from "@/app/modules/components/footer.module";
import Image from "next/image";
import AdaptiveGrid from "@/app/modules/components/adaptiveGrid.module";
import styles_card from "@/app/styles/me/me.module.css";
import asyncImage from "@/app/modules/components/asyncImage.module";
import IconSvg from '@/app/resources/icon.svg';
import { BrowserNotification, calcChecksum } from "./checkBrowserAPI.module";
import { useCookies } from "next-client-cookies";
import { useSearchParams } from "next/navigation";
import { authApi } from "../modules/utils/api.module";
import style_recs from '@/app/styles/workshop/recs.module.css';

export default function WorkshopClient({ recommendations_available }: { recommendations_available: boolean }) {
    const cookies = useCookies();
    const query = useSearchParams();
    const fl_categories = (query.get('filters') ?? '')
        .split(',')
        .filter(filter => !isNaN(Number(filter)) && filter !== '')
        .map(filter => ({
            id: Number(filter),
            name: '',
            icon: '',
            enabled: true
        }))
    const [data, setData] = useState<BandageResponse>(null);
    const [elements, setElements] = useState<JSX.Element[]>(null);
    const [totalCount, setTotalCount] = useState<number>(0);
    const [page, setPage] = useState<number>(0);
    const [take, setTake] = useState<number>(12);
    const [search, setSearch] = useState<string>(query.get('query') || '');

    const [lastConfig, setLastConfig] = useState<AxiosRequestConfig<any>>(null);
    const [categories, setCategories] = useState<Category[]>([]);

    const [filters, setFilters] = useState<Category[]>(fl_categories);
    const [sort, setSort] = useState<String>("popular_up");
    const [alertShown, setAlertShown] = useState<boolean>(false);


    useEffect(() => {
        axios.get(process.env.NEXT_PUBLIC_API_URL + `categories`).then(response => {
            if (response.status == 200) {
                const data = response.data as Category[];
                const categories_load = data.map(cat => {
                    const fl_cat = fl_categories.find(pr => pr.id === cat.id);
                    if (fl_cat) cat.enabled = true;
                    return cat;
                })
                setCategories(categories_load);
            }
        });
    }, [])

    useEffect(() => {
        const filters_str = filters.filter(filter => filter.enabled).map(filter => filter.id).toString();
        const config: AxiosRequestConfig<any> = {
            params: {
                page: constrain(page, 0, Math.ceil(totalCount / take)),
                take: take,
                search: search || undefined,
                filters: filters_str || undefined,
                sort: sort || undefined
            }
        }
        if (JSON.stringify(config) === JSON.stringify(lastConfig)) {
            return;
        }

        axios.get(process.env.NEXT_PUBLIC_API_URL + 'workshop', { withCredentials: true, ...config }).then((response) => {
            if (response.status == 200) {
                const data = response.data as BandageResponse;
                setData(data);
                setTotalCount(data.totalCount);
            }
        });
        setLastConfig(config);
    }, [page, search, take, filters, sort])


    useEffect(() => {
        if (!cookies.get('warningAccepted')) {
            calcChecksum().then(result => !result && setAlertShown(true));
        }
        if (!data) return;
        const skinViewer = new SkinViewer({
            width: 300,
            height: 300,
            renderPaused: true
        });
        skinViewer.camera.rotation.x = -0.4;
        skinViewer.camera.rotation.y = 0.8;
        skinViewer.camera.rotation.z = 0.29;
        skinViewer.camera.position.x = 17;
        skinViewer.camera.position.y = 6.5;
        skinViewer.camera.position.z = 11;
        skinViewer.loadBackground("/static/background.png").then(() => asyncImage('/static/workshop_base.png').then((base_skin) => {
            Promise.all(data.data.map(async (el) => {
                try {
                    const result = await generateSkin(el.base64, base_skin, el.categories.some(val => val.id === Number(process.env.NEXT_PUBLIC_COLORABLE_ID)))
                    await skinViewer.loadSkin(result, { model: 'default' });
                    skinViewer.render();
                    const image = skinViewer.canvas.toDataURL();
                    return <Card el={el} base64={image} key={el.id} className={styles_card} />
                } catch {
                    return;
                }
            })).then(results => setElements(results))
                .catch(error => console.error('Error generating skins', error))
                .finally(() => skinViewer.dispose());
        }));

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
                    {recommendations_available && <Recommendations />}
                    {elements && elements.length > 0 && <Paginator total_count={totalCount} take={take} onChange={setPage} page={page} />}
                    {elements && elements.length > 0 ?
                        <AdaptiveGrid child_width={300} className={styles_card}>{elements}</AdaptiveGrid> :
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
                    {elements && elements.length > 0 && <Paginator total_count={totalCount} take={take} onChange={setPage} page={page} />}
                </div>
                <Footer />
            </main>
        </body>
    );
}

interface RecommendationsResponse {
    skin_accent_colors: string[],
    data: Bandage[]
}

const Recommendations = () => {
    const [data, setData] = useState<RecommendationsResponse>(null);
    const [elements, setElements] = useState<JSX.Element[]>([]);

    useEffect(() => {
        authApi.get('workshop/recommendations/me').then(response => {
            if (response.status !== 200) return;
            setData(response.data);
        })
    }, []);

    useEffect(() => {
        if (!data) return;
        const skinViewer = new SkinViewer({
            width: 300,
            height: 300,
            renderPaused: true
        });
        skinViewer.camera.rotation.x = -0.4;
        skinViewer.camera.rotation.y = 0.8;
        skinViewer.camera.rotation.z = 0.29;
        skinViewer.camera.position.x = 17;
        skinViewer.camera.position.y = 6.5;
        skinViewer.camera.position.z = 11;
        skinViewer.loadBackground('/static/background.png')
            .then(_ => asyncImage('/static/workshop_base.png')
                .then(base_skin => {
                    Promise.all(data.data.map(async (el) => {
                        try {
                            const result = await generateSkin(el.base64, base_skin, el.categories.some(val => val.id === Number(process.env.NEXT_PUBLIC_COLORABLE_ID)))
                            await skinViewer.loadSkin(result, { model: 'default' });
                            skinViewer.render();
                            const image = skinViewer.canvas.toDataURL();
                            return <Card el={el} base64={image} key={el.id} />
                        } catch {
                            return;
                        }
                    })).then(results => setElements(results))
                        .catch(error => console.error('Error generating skins', error))
                        .finally(() => skinViewer.dispose());
                }));

    }, [data]);

    const colors = data?.skin_accent_colors?.map(color =>
        <div
            key={color}
            style={{ backgroundColor: color }}
            className={style_recs.color}
            title={color}
        />
    );

    return (
        <div className={style_recs.main}>
            <div className={style_recs.header}>
                <span className={style_recs.beta}>Beta</span>
                <div className={style_recs.colors}>
                    {colors}
                </div>
            </div>
            <div className={style_recs.body}>
                {elements}
            </div>
        </div>
    )
}