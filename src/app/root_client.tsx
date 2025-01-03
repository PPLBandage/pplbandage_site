"use client";

import React, { JSX, useState } from "react";
import Style from "./styles/root/page.module.css";
import Link from "next/link";
import { CustomLink } from "./modules/components/Search";
import { IconInfinity, IconAlertTriangle, IconStack, IconX } from '@tabler/icons-react';
import NextImage from 'next/image';
import InfoCard from "./modules/components/InfoCard";

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
        <div>
            <div className={Style.main_container}>
                <svg width="958" height="318" className={Style.svg}>
                    <path className={Style.path} d="M 477 159 C -159 -391 -159 709 477 159 C 1113 -391 1113 709 477 159" strokeWidth="3" strokeDasharray="10,10" stroke="rgba(45, 212, 191, .5)" fill="none" />
                </svg>
                <div className={Style.bandages}>
                    {pepes}
                </div>
                <div className={Style.container}>
                    <p className={Style.p}><span className={Style.one}>1</span> Сайт</p>
                    <p className={Style.p} style={{ display: "flex", alignItems: "center" }}><IconInfinity width={40} height={40} className={Style.inf} color='rgba(45, 212, 191)' />Стилей</p>
                    <Link href="/workshop" className={Style.link}><IconStack />Открыть мастерскую</Link>
                    {pong !== 200 &&
                        <InfoCard
                            color="#D29922"
                            style={{ maxWidth: '500px' }}
                            title={
                                <div style={{ display: 'flex', flexDirection: 'row', alignItems: 'center', gap: '.5rem' }}>
                                    <IconAlertTriangle width={24} height={24} />
                                    <p style={{ margin: 0 }}>Service Unavailable</p>
                                </div>
                            }
                        >
                            <span>Сервис в настоящий момент недоступен. Попробуйте позже или обратитесь в <CustomLink href="/contacts">администрацию</CustomLink></span>
                        </InfoCard>

                    }
                </div>
            </div>
            <footer className={Style.footer}>
                <p>Сайт pplbandage.ru не является официальной частью сети серверов <Link href='https://pepeland.net' style={{ color: 'gray' }} target="_blank">PepeLand</Link>.</p>
                <div className={Style.collaborate}>
                    <Link
                        href='https://t.me/shapestd'
                        style={{ display: 'contents' }}
                        target="_blank"
                        className={Style.shape}
                    >
                        <div className={Style.shape_box}>
                            <p className={Style.shape_name} style={{ whiteSpace: 'nowrap' }}>Shape std</p>
                        </div>
                        <NextImage src='/static/icons/shape.svg' alt='' width={24} height={24} />
                    </Link>
                    <IconX width={16} height={16} strokeWidth={3} />
                    <NextImage src='/static/icons/icon-cropped.svg' alt='' width={24} height={24} />
                </div>
            </footer>
        </div>
    )
}

export default HomeClient;