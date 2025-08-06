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
            <div className={styles.main_container}>
                <div className={styles.left_shade} />
                <div className={`${styles.left_shade} ${styles.right_shade}`} />
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
                    <div className={styles.image_container}>
                        <SkinRender width={400} height={545} />
                        <svg
                            width="250"
                            height="120"
                            xmlns="http://www.w3.org/2000/svg"
                            className={styles.shadow}
                        >
                            <ellipse rx="125" ry="60" cx="125" cy="60" />
                        </svg>
                    </div>
                </div>
            </div>
            <footer className={styles.footer}>
                <p>
                    Сайт pplbandage.ru не является официальной частью сети серверов{' '}
                    <Link href="https://pepeland.net" target="_blank">
                        PepeLand
                    </Link>
                    .
                    <Link href="/tutorials/rules#PP" style={{ marginLeft: '.5rem' }}>
                        Privacy Policy
                    </Link>
                </p>
                <IconCropped width={24} height={24} className={styles.logo} />
            </footer>
        </div>
    );
};

export default HomeClient;
