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
import NextImage from 'next/image';
import { getCookie } from "cookies-next";
import { authApi } from "../api.module";
import Link from "next/link";
import { fillPepe } from "../client.module";
import { Paginator } from "../modules/paginator.module";
import { Search } from "../modules/search.module";

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
    const [take, setTake] = useState<number>(10);
    const [search, setSearch] = useState<string>("");


    useEffect(() => {
        axios.get(`/api/bandages?page=${constrain(page, 0, Math.ceil(totalCount / take))}&take=${take}&search=${search}`, { withCredentials: true }).then((response) => {
            const data = response.data as BandageResponse;
            setData(data);
            setTotalCount(data.totalCount);
        })
    }, [page, search, take])

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
                    const result = await generateSkin(el.base64, el.colorable);
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
            <Search onSearch={setSearch} onChangeTake={setTake} />
            <Paginator total_count={totalCount} take={take} onChange={setPage}/>
            <div className={Style.skins_container}>{elements}</div>
          </div>
        </main>
      </body>
  );
}

const b64Prefix = "data:image/png;base64,";

const generateSkin = (b64: string, colorable: boolean): Promise<string> => {
    return new Promise((resolve, reject) => {
        const bandage = new Image();
        bandage.src = b64Prefix + b64;

        bandage.onload = () => {
            const height = Math.floor(bandage.height / 2);
            const skin_canvas = document.createElement("canvas") as HTMLCanvasElement;
            skin_canvas.width = 64;
            skin_canvas.height = 64;

            const skin = new Image();
            skin.onload = () => {
                const context = skin_canvas.getContext("2d");
                if (context) {
                    context.drawImage(skin, 0, 0);

                    const position = 6 - Math.floor(height / 2);
                    
                    let bandage_new: HTMLCanvasElement | HTMLImageElement;
                    if (colorable){
                        bandage_new = fillPepe(bandage, [randint(0, 255), randint(0, 255), randint(0, 255)]);
                    }else{
                        bandage_new = bandage;
                    }

                    context.drawImage(bandage_new, 0, 0, 16, height, 48, 52 + position, 16, height);
                    context.drawImage(bandage_new, 0, height, 16, height, 32, 52 + position, 16, height);

                    const result = skin_canvas.toDataURL();
                    resolve(result);
                } else {
                    reject(new Error("Failed to get 2D context"));
                }
            };
        skin.onerror = () => reject(new Error("Failed to load skin image"));
        skin.src = "./static/workshop_base.png";
        };

        bandage.onerror = () => reject(new Error("Failed to load bandage image"));
    });
};

interface Bandage {
    id: number;
    external_id: string,
    base64: string,
    userId: number,
    creation_date: Date,
    verified: boolean,
    stars_count: number,
    starred: boolean,
    title: string,
    description: string,
    colorable: boolean,
    User: {
        id: number,
        username: string,
        name: string
    }
}

interface BandageResponse {
    data: Bandage[],
    totalCount: number
}

const formatDate = (date: Date) => {
    const hours = date.getHours().toString().padStart(2, '0');
    const minutes = date.getMinutes().toString().padStart(2, '0');
    const day = date.getDate().toString().padStart(2, '0');
    const month = (date.getMonth() + 1).toString().padStart(2, '0');
    const year = date.getFullYear().toString();
    return `${hours}:${minutes} ${day}.${month}.${year}`;
}


const randint = (min: number, max: number): number => {
    return Math.random() * (max - min) + min;
}

const Card = ({el, base64}: {el: Bandage, base64: string}): JSX.Element => {
    const logged = getCookie("sessionId");
    let starred = !el.starred;

    return  (<div key={el.id}>
        <div className={Style.star_container}>
            <NextImage 
                src={`/static/icons/star${!el.starred ? "_empty" : ""}.svg`}
                className={Style.star}
                draggable="false"
                alt="star"
                width={24} 
                height={24} 
                id={el.external_id + "_star"}
                style={logged ? {cursor: "pointer"} : {}} 
                onClick={() => {
                    if (logged){
                        authApi.put(`/star/${el.external_id}?set=${starred}`).then((response) => {
                            if (response.status == 200){
                                const response_data: {new_count: number, action_set: boolean} = response.data;
                                (document.getElementById(el.external_id + "_star") as HTMLImageElement)
                                        .src = `/static/icons/star${!response_data.action_set ? "_empty" : ""}.svg`;
                                (document.getElementById(el.external_id + "_text") as HTMLSpanElement)
                                        .textContent = response_data.new_count.toString();
                                starred = !response_data.action_set;
                            }
                        })
                    }
                }}/>
            <span className={Style.star_count} id={el.external_id + "_text"}>{el.stars_count}</span>
        </div>
        <NextImage src={base64} className={Style.skin} alt={el.external_id} width={300} height={300} draggable="false" />
        <div className={Style.skin_descr}>
            <Link className={Style.header} href={`/editor/${el.external_id}`}>{el.title} ({el.id})</Link>
            <p className={Style.description}>{el.description}</p>
            {el.colorable && <p className={Style.username} style={{marginTop: ".3rem"}}><img src="/static/icons/color-palette.svg" style={{width: "1.5rem"}} />Окрашиваемая</p>}
            <p className={Style.username}><img src="/static/icons/user.svg" style={{width: "1.5rem"}}/>{el.User.name}</p>
            <p className={Style.creation_date}>{formatDate(new Date(el.creation_date))}</p>
        </div>
    </div>)
}

const constrain = (val: number, min_val: number, max_val: number) => {
    return Math.min(max_val, Math.max(min_val, val))
}