'use client';

import React, { useState } from 'react';
import styles from './styles/root/page.module.css';
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
            className={styles.img}
            style={{
                animationDelay: `-${4 * index}s`,
                animationPlayState: animationState ? 'running' : 'paused'
            }}
            href={`/workshop/${path}`}
        >
            <Pepe
                onMouseEnter={() => setAnimationState(false)}
                onMouseLeave={() => setAnimationState(true)}
            />
        </Link>
    ));

    return (
        <div>
            <div className={styles.main_container}>
                <svg width="958" height="318" className={styles.svg}>
                    <path
                        className={styles.path}
                        d="M 477 159 C -159 -391 -159 709 477 159 C 1113 -391 1113 709 477 159"
                        strokeWidth="3"
                        strokeDasharray="10,10"
                        stroke="rgba(45, 212, 191, .5)"
                        fill="none"
                    />
                </svg>
                <div className={styles.bandages}>{pepes}</div>
                <div className={styles.container}>
                    <p className={styles.p}>
                        <span className={styles.one}>1</span> Сайт
                    </p>
                    <p className={styles.p}>
                        <IconInfinity
                            width={40}
                            height={40}
                            className={styles.inf}
                            color="rgba(45, 212, 191)"
                        />
                        Стилей
                    </p>
                    <Link href="/workshop" className={styles.link}>
                        <IconStack />
                        Открыть мастерскую
                    </Link>
                    {pong !== 200 && (
                        <InfoCard
                            color="#D29922"
                            style={{ maxWidth: '500px' }}
                            title={
                                <div className={styles.service_unavailable}>
                                    <IconAlertTriangle width={24} height={24} />
                                    <p>Service Unavailable</p>
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
            <footer className={styles.footer}>
                <p>
                    Сайт pplbandage.ru не является официальной частью сети
                    серверов{' '}
                    <Link href="https://pepeland.net" target="_blank">
                        PepeLand
                    </Link>
                    .
                </p>
                <div className={styles.collaborate}>
                    <Link
                        href="https://t.me/shapestd"
                        target="_blank"
                        className={styles.shape}
                    >
                        <div className={styles.shape_box}>
                            <p className={styles.shape_name}>Shape std</p>
                        </div>
                        <IconShape width={24} height={24} />
                    </Link>
                    <IconX width={16} height={16} strokeWidth={3} />
                    <IconCropped width={24} height={24} />
                </div>
            </footer>
        </div>
    );
};

export default HomeClient;
