"use client";

import React from "react";
import { useEffect, useState, useRef } from "react";
import { SkinViewer } from 'skinview3d';
import Header from "../modules/header.module";
import Style from "../styles/workshop/page.module.css";
import {
  QueryClient,
  QueryClientProvider,
  useQuery,
} from "@tanstack/react-query";
import axios from "axios";
import { Paginator } from "../modules/paginator.module";
import { Search } from "../modules/search.module";
import { Bandage, BandageResponse, Category } from "../interfaces";
import { Card, constrain, generateSkin } from "../modules/card.module";

const queryClient = new QueryClient();

/*
<aside className={Style.filters}>
    <h2>Фильтры</h2>
</aside>
*/
export default function Home() {
    const [data, setData] = useState<BandageResponse>(null);
    const [elements, setElements] = useState<JSX.Element[]>([]);
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
        const request = `/api/bandages?page=${constrain(page, 0, Math.ceil(totalCount / take))}&take=${take}&search=${search}` + 
                        `&filters=${filters_str}&sort=${sort}`;

        if (request == lastRequest){
            return;
        }

        axios.get(request, { withCredentials: true }).then((response) => {
            if (response.status == 200){
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
                    await skinViewer.loadSkin(result);
                    skinViewer.render();
                    const image = skinViewer.canvas.toDataURL();
                    return <Card el={el} base64={image} key={el.id}/>
                    } catch {
                        return;
                    }
                }))
                .then(results => setElements(results))
                .catch(error => console.error('Error generating skins', error))
                .finally(() => skinViewer.dispose());
            });
        }
    }, [data]);

    return (
      <body>
        <Header />

        <main className={Style.main}>
          <div className={Style.center}>
            <Search onSearch={setSearch} onChangeTake={setTake} categories={categories} onChangeSort={setSort} onChangeFilters={setFilters}/>
            <Paginator total_count={totalCount} take={take} onChange={setPage}/>
            <div className={Style.skins_container}>{elements}</div>
          </div>
        </main>
      </body>
  );
}
