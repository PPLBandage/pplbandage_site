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
import { Me } from '@/app/modules/components/me.module';
import { redirect } from 'next/navigation'
import { SimpleGrid } from '@/app/modules/components/adaptiveGrid.module';
import { renderSkin } from '@/app/modules/utils/skinCardRender.module';

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
                setData((response.data as Bandage[]).reverse());
            }
        })
    }, []);


    useEffect(() => {
        data && renderSkin(data, styles_me).then(results => setElements(results));
    }, [data]);

    useEffect(() => {
        setIsLogged(logged != undefined);
        if (!logged) {
            redirect('/me');
        }
    }, [logged])

    return (
        <body>
            <Header />
            {isLogged &&
                <Me>
                    {data && data.length != 0 ?
                        <div id="sidebar" className={style_sidebar.skins_container_2} style={elements ? { opacity: "1", transform: "translateY(0)" } : { opacity: "0", transform: "translateY(50px)" }}>
                            <SimpleGrid>{elements}</SimpleGrid>
                        </div> :
                        <div className={style_sidebar.animated} style={elements ? { opacity: "1", transform: "translateY(0)", width: "100%" } : { opacity: "0", transform: "translateY(50px)", width: "100%" }}>
                            <p style={{ display: "flex", alignItems: "center", fontSize: "1.1rem", fontWeight: 500, width: "100%", justifyContent: "center", margin: 0 }}><Image style={{ marginRight: ".5rem" }} src="/static/theres_nothing_here.png" alt="" width={56} height={56} />Похоже, тут ничего нет</p>
                        </div>
                    }
                </Me>
            }
        </body>
    );
}

export default Main;
