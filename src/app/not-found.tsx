"use client";

import { useEffect, useState } from 'react';
import { Cookies, useCookies } from 'next-client-cookies';
import style from "./styles/404/page.module.css";
import "./styles/404/style.css";
import Header from './modules/header.module';

export default function NotFound() {
    const cookies = useCookies();
    const [dark, set_dark] = useState(cookies.get("dark") === "true");

    useEffect(() => {
        let circle1 = document.getElementById("circle-1") as HTMLDivElement;
        circle1.style.top = "60%";

        let circle2 = document.getElementById("circle-2") as HTMLDivElement;
        circle2.style.top = "40%";
    }, []);

    
    return (
        <body className={`${style.body} ${dark ? style.dark : ""}`} style={{ colorScheme: dark ? "dark" : "light" }}>
            <Header />
            <meta name="description" content="Повязка Пепеленда для всех! Хотите себе на скин модную повязку Pepeland? Тогда вам сюда!" />
			<link rel="shortcut icon" href="/static/icons/icon.svg" type="image/svg+xml"></link>
            <div className={style.circle} id="circle-1"></div>
            <div className={style.circle} id="circle-2" style={{left: "60%", top: "60%", backgroundColor: "rgb(126 255 244)"}}></div>
            <main className={style.main}>
                <h1>404</h1>
                <h2 style={{margin: 0, marginBottom: "0.5%"}}>Page not found</h2>
                <div>
                    <a href="/" className={style.home}>Return to home</a>
                </div>
            </main>
        </body>);
}