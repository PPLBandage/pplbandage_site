"use client";

import React from 'react';
import { useEffect, useState, useRef } from 'react';
import { authApi } from "@/app/modules/utils/api.module";
import style_sidebar from "@/app/styles/me/sidebar.module.css";
import Header from "@/app/modules/components/header.module";
import useCookie from '@/app/modules/utils/useCookie.module';
import { Cookies, useCookies } from 'next-client-cookies';
import styles_me from "@/app/styles/me/me.module.css";
import Image from 'next/image';
import { Bandage } from '@/app/interfaces';
import { SkinViewer } from 'skinview3d';
import { Card, generateSkin } from '@/app/modules/components/card.module';
import { Me } from '@/app/modules/components/me.module';
import { redirect } from 'next/navigation'
import AdaptiveGrid from '@/app/modules/components/adaptiveGrid.module';
import asyncImage from "@/app/modules/components/asyncImage.module";

const Main = () => {
    const cookies = useRef<Cookies>(useCookies());
    const logged = useCookie('sessionId');
    const [isLogged, setIsLogged] = useState<boolean>(cookies.current.get('sessionId') != undefined);

    const [elements, setElements] = useState<JSX.Element[]>(null);
    const [data, setData] = useState<Bandage[]>(null);

    if (!cookies.current.get('sessionId')) {
        redirect('/me');
    }

    useEffect(() => {
        authApi.get("user/me/stars").then((response) => {
            if (response.status === 200) {
                setData(response.data as Bandage[]);
            }
        })
    }, []);


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
            skinViewer.loadBackground("/static/background.png").then(() => asyncImage('/static/workshop_base.png').then((base_skin) => {
                Promise.all(data.map(async (el) => {
                    try {
                        const result = await generateSkin(el.base64, base_skin, el.categories.some(val => val.id == 3))
                        await skinViewer.loadSkin(result, { model: 'default' });
                        skinViewer.render();
                        const image = skinViewer.canvas.toDataURL();
                        return <Card el={el} base64={image} key={el.id} className={styles_me} />
                    } catch {
                        return;
                    }
                })).then(results => setElements(results))
                    .catch(error => console.error('Error generating skins', error))
                    .finally(() => skinViewer.dispose());
            }));
        }
    }, [data]);

    useEffect(() => {
        setIsLogged(logged != undefined);
        if (!logged) {
            redirect('/me');
        }
    }, [logged])

    return (
        <body>
            <title>Избранное · Повязки Pepeland</title>
            <meta name="description" content="Избранные работы в мастерской." />
            <meta name="og:title" content="Избранное · Повязки Pepeland" />
            <meta name="og:description" content="Избранные работы в мастерской." />
            <Header />
            {isLogged &&
                <Me>
                    {data && data.length != 0 ? <div className={style_sidebar.skins_container_2} style={elements ? { opacity: "1", transform: "translateY(0)" } : { opacity: "0", transform: "translateY(50px)" }}>
                        <AdaptiveGrid child_width={300}>{elements}</AdaptiveGrid>
                    </div> :
                        <div className={style_sidebar.animated} style={elements ? { opacity: "1", transform: "translateY(0)", width: "100%" } : { opacity: "0", transform: "translateY(50px)", width: "100%" }}>
                            <p style={{ display: "flex", alignItems: "center", fontSize: "1.1rem", fontWeight: 500, width: "100%", justifyContent: "center", margin: 0 }}><Image style={{ marginRight: ".5rem" }} src="/static/theres_nothing_here.png" alt="" width={56} height={56} />Похоже, тут ничего нет</p>
                        </div>}
                </Me>
            }
        </body>
    );
}

export default Main;
