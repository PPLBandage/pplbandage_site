'use client';

import React, { useState } from 'react';
import Style from './styles/root/page.module.css';
import Link from 'next/link';
import { CustomLink } from './modules/components/Search';
import {
    IconInfinity,
    IconAlertTriangle,
    IconStack,
    IconX
} from '@tabler/icons-react';
import InfoCard from './modules/components/InfoCard';

// Import pepes images
import Pepe0 from '@/app/resources/pepes_svg/0.svg';
import Pepe1 from '@/app/resources/pepes_svg/1.svg';
import Pepe2 from '@/app/resources/pepes_svg/2.svg';
import Pepe3 from '@/app/resources/pepes_svg/3.svg';
import Pepe4 from '@/app/resources/pepes_svg/4.svg';
import Pepe5 from '@/app/resources/pepes_svg/5.svg';
import Pepe6 from '@/app/resources/pepes_svg/6.svg';
import Pepe7 from '@/app/resources/pepes_svg/7.svg';
import Pepe8 from '@/app/resources/pepes_svg/8.svg';
import Pepe9 from '@/app/resources/pepes_svg/9.svg';

import IconCropped from '@/app/resources/icon-cropped.svg';
import IconShape from '@/app/resources/shape.svg';

const pepesObj = {
    ogukal: Pepe0,
    gauu3s: Pepe1,
    pe5s4d: Pepe2,
    x4rak9: Pepe3,
    '3t75jf': Pepe4,
    wrbs4h: Pepe5,
    t6i5ld: Pepe6,
    gnikzr: Pepe7,
    by1lzs: Pepe8,
    '4psolk': Pepe9
};

const HomeClient = ({ pong }: { pong: number }) => {
    const [animationState, setAnimationState] = useState<boolean>(true);

    const pepes = Object.entries(pepesObj).map(([path, Pepe], index) => (
        <Link
            key={index}
            className={Style.img}
            style={{
                animationDelay: `-${4 * index}s`,
                animationPlayState: animationState ? 'running' : 'paused'
            }}
            href={`/workshop/${path}`}
        >
            <Pepe
                style={{ width: '60px', height: 'auto' }}
                onMouseEnter={() => setAnimationState(false)}
                onMouseLeave={() => setAnimationState(true)}
            />
        </Link>
    ));

    return (
        <div>
            <div className={Style.main_container}>
                <svg width="958" height="318" className={Style.svg}>
                    <path
                        className={Style.path}
                        d="M 477 159 C -159 -391 -159 709 477 159 C 1113 -391 1113 709 477 159"
                        strokeWidth="3"
                        strokeDasharray="10,10"
                        stroke="rgba(45, 212, 191, .5)"
                        fill="none"
                    />
                </svg>
                <div className={Style.bandages}>{pepes}</div>
                <div className={Style.container}>
                    <p className={Style.p}>
                        <span className={Style.one}>1</span> Сайт
                    </p>
                    <p
                        className={Style.p}
                        style={{ display: 'flex', alignItems: 'center' }}
                    >
                        <IconInfinity
                            width={40}
                            height={40}
                            className={Style.inf}
                            color="rgba(45, 212, 191)"
                        />
                        Стилей
                    </p>
                    <Link href="/workshop" className={Style.link}>
                        <IconStack />
                        Открыть мастерскую
                    </Link>
                    {pong !== 200 && (
                        <InfoCard
                            color="#D29922"
                            style={{ maxWidth: '500px' }}
                            title={
                                <div
                                    style={{
                                        display: 'flex',
                                        flexDirection: 'row',
                                        alignItems: 'center',
                                        gap: '.5rem'
                                    }}
                                >
                                    <IconAlertTriangle width={24} height={24} />
                                    <p style={{ margin: 0 }}>
                                        Service Unavailable
                                    </p>
                                </div>
                            }
                        >
                            <span>
                                Сервис в настоящий момент недоступен. Попробуйте
                                позже или обратитесь в{' '}
                                <CustomLink href="/contacts">
                                    администрацию
                                </CustomLink>
                            </span>
                        </InfoCard>
                    )}
                </div>
            </div>
            <footer className={Style.footer}>
                <p>
                    Сайт pplbandage.ru не является официальной частью сети
                    серверов{' '}
                    <Link
                        href="https://pepeland.net"
                        style={{ color: 'gray' }}
                        target="_blank"
                    >
                        PepeLand
                    </Link>
                    .
                </p>
                <div className={Style.collaborate}>
                    <Link
                        href="https://t.me/shapestd"
                        style={{ display: 'contents' }}
                        target="_blank"
                        className={Style.shape}
                    >
                        <div className={Style.shape_box}>
                            <p
                                className={Style.shape_name}
                                style={{ whiteSpace: 'nowrap' }}
                            >
                                Shape std
                            </p>
                        </div>
                        <IconShape alt="" width={24} height={24} />
                    </Link>
                    <IconX width={16} height={16} strokeWidth={3} />
                    <IconCropped alt="" width={24} height={24} />
                </div>
            </footer>
        </div>
    );
};

export default HomeClient;
