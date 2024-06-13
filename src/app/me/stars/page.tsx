"use client";

import React, { use } from 'react';
import { useEffect, useState, useRef } from 'react';
import { authApi } from "@/app/api.module";
import { useRouter } from "next/navigation";
import style_sidebar from "../../styles/me/sidebar.module.css";
import Header from "../../modules/header.module";
import useCookie from '../../modules/useCookie.module';
import { Cookies, useCookies } from 'next-client-cookies';
import {
    QueryClient,
    QueryClientProvider,
    useQuery,
  } from "@tanstack/react-query";
import Image from 'next/image';
import Link from 'next/link';
import { Bandage } from '@/app/interfaces';
import { SkinViewer } from 'skinview3d';
import { Card, formatDate, generateSkin } from '@/app/modules/card.module';
import { Me } from '@/app/modules/me.module';

const queryClient = new QueryClient();

export default function Home() {
    return (
        <QueryClientProvider client={queryClient}>
            <Main/>
        </QueryClientProvider>
    );
}


const Main = () => {
    const router = useRouter();
    const cookies = useRef<Cookies>(useCookies());
    const logged = useCookie('sessionId');
    const [isLogged, setIsLogged] = useState<boolean>(cookies.current.get('sessionId') != undefined);

    const [elements, setElements] = useState<JSX.Element[]>(null);

    const { data, isLoading, isError } = useQuery({
        queryKey: ["userWorks"],
        retry: 5,
        queryFn: async () => {
            const res = await authApi.get("users/me/stars", {withCredentials: true});
            return res.data as Bandage[] || undefined;
  
        },
    });

    useEffect(() => {
        if (!isLogged) {
            router.replace('/me');
        }
    }, [])

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

                Promise.all(data.map(async (el) => {
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

    useEffect(() => {
        setIsLogged(logged != undefined);
    }, [logged])

    return (
    <body style={{backgroundColor: "#17181C", margin: 0}}>
        <Header/>
        {isLogged &&
            <Me>
                {data && data.length != 0 ? <div className={style_sidebar.skins_container} style={elements ? {opacity: "1", transform: "translateY(0)"} : {opacity: "0", transform: "translateY(50px)"}}>
                    {elements}
                </div> : 
                <div className={style_sidebar.animated} style={elements ? {opacity: "1", transform: "translateY(0)", width: "100%"} : {opacity: "0", transform: "translateY(50px)", width: "100%"}}>
                    <p style={{display: "flex", alignItems: "center", fontSize: "1.1rem", fontWeight: 500, width: "100%", justifyContent: "center", margin: 0}}><Image style={{marginRight: ".5rem"}} src="/static/theres_nothing_here.png" alt="" width={56} height={56} />Похоже, тут ничего нет</p>
                </div>}
            </Me>
        }
    </body>
    );
}
