"use client";

import Image from "next/image";
import Header from "./modules/components/header.module";
import React, { useState } from "react";
import Style from "./styles/root/page.module.css";
import Link from "next/link";
import { CustomLink } from "./modules/components/search.module";


const HomeClient = ({ pong }: { pong: number }) => {
    const [animationState, setAnimationState] = useState<boolean>(true);
    const pepes_links = ['ogukal', 'gauu3s', 'pe5s4d', 'x4rak9', '3t75jf', 'wrbs4h', 't6i5ld', 'gnikzr', 'by1lzs', '4psolk'];

    let pepes: JSX.Element[] = [];
    for (let i = 0; i < 10; i++) {
        pepes.push(
            <a key={i}
                className={Style.img}
                style={{ animationPlayState: animationState ? 'running' : 'paused' }}
                href={`/workshop/${pepes_links[i]}`}>
                <img alt=""
                    src={`/static/pepes_main/${i}.png`}
                    draggable={false}
                    style={{ width: '60px' }}
                    onMouseEnter={() => setAnimationState(false)}
                    onMouseLeave={() => setAnimationState(true)} />
            </a>
        )
    }
    return (
        <body style={{ overflow: "hidden", overflowY: "scroll" }}>
            <Header />
            <div className={Style.test}>
                <svg width="958" height="318" className={Style.svg}>
                    <path className={Style.path} d="M 477 159 C -159 -391 -159 709 477 159 C 1113 -391 1113 709 477 159" strokeWidth="3" strokeDasharray="10,10" stroke="rgba(45, 212, 191, .5)" fill="none" />
                </svg>
                <div className={Style.bandages}>
                    {pepes}
                </div>
                <div className={Style.container}>
                    <p className={Style.p}><span className={Style.one}>1</span> Сайт</p>
                    <p className={Style.p} style={{ display: "flex", alignItems: "center" }}><Image src="/static/icons/infinity.svg" alt="" width={40} height={40} className={Style.inf} draggable={false} />Стилей</p>
                    <Link href="/workshop" className={Style.link}>Открыть мастерскую</Link>
                    {pong !== 200 &&
                        <div className={Style.api_unavailable}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '.5rem' }}>
                                <Image src='/static/icons/blocks/warning.svg' alt="warning" width={24} height={24} />
                                <h3 style={{ margin: 0 }}>Service Unavailable</h3>
                            </div>
                            <p>Сервис в настоящий момент недоступен. Попробуйте позже или обратитесь в <CustomLink href="/contacts">администрацию</CustomLink></p>
                        </div>
                    }
                </div>
            </div>
            <footer className={Style.footer}>
                <p>Сайт pplbandage.ru не является официальной частью сети серверов PepeLand.</p>
            </footer>
        </body>
    )
}

export default HomeClient;