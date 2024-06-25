"use client";

import style from "./styles/404/page.module.css";
import "./styles/404/style.css";
import { useEffect } from 'react';

const NotFoundElement = () => {
    useEffect(() => {
        const circle1 = document.getElementById("circle-1") as HTMLDivElement;
        circle1.style.top = "60%";

        const circle2 = document.getElementById("circle-2") as HTMLDivElement;
        circle2.style.top = "40%";
    }, []);

    return <div className={style.body}>
        <div className={style.circle} id="circle-1"></div>
        <div className={style.circle} id="circle-2" style={{left: "60%", top: "60%", backgroundColor: "rgb(126 255 244)"}}></div>
        <main className={style.main}>
            <h1>404</h1>
            <h2 style={{margin: 0, marginBottom: "0.5%"}}>Page not found</h2>
            <div>
                <a href="/" className={style.home}>Return to home</a>
            </div>
        </main>
    </div>
}

export default NotFoundElement;