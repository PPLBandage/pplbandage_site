"use client";

import React from 'react';
import { useEffect, useState, useRef } from 'react';
import { authApi } from "@/app/api.module";
import style_sidebar from "../../styles/me/sidebar.module.css";
import Header from "../../modules/header.module";
import useCookie from '../../modules/useCookie.module';
import { Cookies, useCookies } from 'next-client-cookies';
import styles_me from "../../styles/me/me.module.css";
import Image from 'next/image';
import { Bandage } from '@/app/interfaces';
import { SkinViewer } from 'skinview3d';
import { Card, generateSkin } from '@/app/modules/card.module';
import { Me } from '@/app/modules/me.module';
import { redirect } from 'next/navigation'

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
        authApi.get("users/me/stars").then((response) => {
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
            skinViewer.loadBackground("/static/background.png").then(() => {

                Promise.all(data.map(async (el) => {
                    try {
                        const result = await generateSkin(el.base64, Object.values(el.categories).some(val => val.id == 3))
                        await skinViewer.loadSkin(result);
                        skinViewer.render();
                        const image = skinViewer.canvas.toDataURL();
                        return <Card el={el} base64={image} key={el.id} className={styles_me} />
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
        if (!logged) {
            redirect('/me');
        }
    }, [logged])

    return (
        <body>
            <title>Избранное · Повязки Pepeland</title>
            <Header />
            {isLogged &&
                <Me>
                    {data && data.length != 0 ? <div className={style_sidebar.skins_container} style={elements ? { opacity: "1", transform: "translateY(0)" } : { opacity: "0", transform: "translateY(50px)" }}>
                        {elements}
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
