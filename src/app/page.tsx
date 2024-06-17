"use client";

import React from "react";
import Header from "./modules/header.module";
import Style from "./styles/root/page.module.css";
import Image from "next/image";
import Link from "next/link";

export default function Home() {
    let pepes: JSX.Element[] = [];
    for (let i = 0; i < 10; i++) {
        pepes.push(<img key={i} alt="" className={Style.img} src={`/static/pepes_main/${i}.png`} draggable={false}/>)
    }
    return (
        <body style={{overflow: "hidden", overflowY: "scroll"}}>
            <Header/>
            <div className={Style.test}>
                <svg width="958" height="318" className={Style.svg}>
                    <path className={Style.path} d="M 477 159 C -159 -391 -159 709 477 159 C 1113 -391 1113 709 477 159" strokeWidth="3" strokeDasharray="10,10" stroke="rgba(45, 212, 191, .5)" fill="none" />
                </svg>
                <div className={Style.bandages}>
                    {pepes}
                </div>
                <div className={Style.container}>
                    <p className={Style.p}><span className={Style.one}>1</span> Сайт</p>
                    <p className={Style.p} style={{display: "flex", alignItems: "center"}}><Image src="/static/icons/infinity.svg" alt="inf" width={40} height={40} className={Style.inf}/>Стилей</p>
                    <Link href="/workshop" className={Style.link}>Открыть мастерскую</Link>
                </div>
            </div>
        </body>
    )
}

