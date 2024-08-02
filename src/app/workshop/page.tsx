"use client";

import React from "react";
import { useEffect, useState } from "react";
import { SkinViewer } from 'skinview3d';
import Header from "../modules/header.module";
import Style from "../styles/workshop/page.module.css";

import axios from "axios";
import { Paginator } from "../modules/paginator.module";
import { Search } from "../modules/search.module";
import { BandageResponse, Category } from "../interfaces";
import { Card, constrain, generateSkin } from "../modules/card.module";
import Footer from "../modules/footer.module";
import Image from "next/image";
import AdaptiveGrid from "../modules/adaptiveGrid.module";


export default function Home() {
    const [data, setData] = useState<BandageResponse>(null);
    const [elements, setElements] = useState<JSX.Element[]>(null);
    const [totalCount, setTotalCount] = useState<number>(0);
    const [page, setPage] = useState<number>(0);
    const [take, setTake] = useState<number>(12);
    const [search, setSearch] = useState<string>("");

    const [lastRequest, setLastRequest] = useState<string>("");
    const [categories, setCategories] = useState<Category[]>([]);

    const [filters, setFilters] = useState<Category[]>([]);
    const [sort, setSort] = useState<String>("popular_up");


    useEffect(() => {
        axios.get(`/api/categories`).then((response) => {
            if (response.status == 200) {
                setCategories(response.data as Category[]);
            }
        });
    }, [])

    useEffect(() => {
        const filters_str = filters.filter((filter) => filter.enabled).map((filter) => filter.id).toString();
        const request = `/api/workshop?page=${constrain(page, 0, Math.ceil(totalCount / take))}&take=${take}&search=${search}` +
            `&filters=${filters_str}&sort=${sort}`;

        if (request == lastRequest) {
            return;
        }

        axios.get(request, { withCredentials: true }).then((response) => {
            if (response.status == 200) {
                const data = response.data as BandageResponse;
                setData(data);
                setTotalCount(data.totalCount);
            }
        });
        setLastRequest(request);
    }, [page, search, take, filters, sort])

    useEffect(() => {
        if (data) {
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
            skinViewer.loadBackground("/static/background.png").then(() => {

                Promise.all(data.data.map(async (el) => {
                    try {
                        const result = await generateSkin(el.base64, Object.values(el.categories).some(val => val.id == 3))
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
            });
        }
    }, [data]);

    return (
        <body>
            <title>Мастерская · Повязки Pepeland</title>
            <meta name="description" content="Главная страница мастерской" />
            <Header />
            <main className={Style.main}>
                <div className={Style.center}>
                    <Search onSearch={setSearch} onChangeTake={setTake} categories={categories} onChangeSort={setSort} onChangeFilters={setFilters} />
                    <Paginator total_count={totalCount} take={take} onChange={setPage} />
                    {elements && elements.length > 0 ? <AdaptiveGrid child_width={300}>{elements}</AdaptiveGrid> :
                        elements && elements.length === 0 ?
                            <>
                                <p style={{ display: "flex", alignItems: "center", fontSize: "1.1rem", fontWeight: 500, width: "100%", justifyContent: "center", margin: 0 }}>
                                    <Image style={{ marginRight: ".5rem" }} src="/static/theres_nothing_here.png" alt="" width={56} height={56} />Похоже, тут ничего нет</p>
                            </> :
                            <Image src="/static/icons/icon.svg" alt="" width={86} height={86} className={Style.loading} />
                    }
                </div>
                <Footer />
            </main>
        </body>
    );
}
