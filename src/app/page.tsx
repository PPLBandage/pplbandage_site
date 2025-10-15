'use client';

import React from 'react';
import styles from '@/styles/root/page.module.css';
import Link from 'next/link';

import IconCropped from '@/resources/icon-cropped.svg';
import { GeistSans } from 'geist/font/sans';
import { GeistMono } from 'geist/font/mono';
import SkinRender from '@/components/root/MainSkinView';

const HomeClient = () => {
    return (
        <div>
            <div className={styles.background} />
            <div
                className={`${styles.background_icons} ${styles.background_icons_blur}`}
            />
            <div className={styles.background_icons} />
            <div className={styles.main_container}>
                <div className={styles.container}>
                    <div className={styles.texts}>
                        <h1 className={`${styles.h1} ${GeistSans.className}`}>
                            Огромная библиотека повязок{' '}
                            <span className={styles.pepeland}>Пепеленда</span>
                        </h1>
                        <p className={styles.description}>
                            Место, где любой найдет дизайн по вкусу.
                        </p>
                        <div className={styles.links}>
                            <Link href="/workshop" className={styles.links_workshop}>
                                Мастерская
                            </Link>
                            <Link href="/me">Личный кабинет</Link>
                        </div>
                        <p className={`${styles.by_andcool} ${GeistMono.className}`}>
                            <IconCropped />
                            {' by '}
                            <Link href={'https://andcool.ru'}>AndcoolSystems</Link>
                        </p>
                    </div>
                    <SkinRender width={600} height={950} />
                </div>
            </div>
        </div>
    );
};

export default HomeClient;
