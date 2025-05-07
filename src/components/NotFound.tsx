'use client';

import style from '@/styles/404/page.module.css';
import '@/styles/404/style.css';
import { IconArrowBack } from '@tabler/icons-react';
import Link from 'next/link';

const NotFoundElement = () => {
    return (
        <div className={style.body}>
            <div className={style.circle}></div>
            <div className={`${style.circle} ${style.circle_2}`}></div>
            <main className={style.main}>
                <h1>404</h1>
                <h2 style={{ margin: 0, marginBottom: '.78rem' }}>
                    Страница не найдена
                </h2>
                <div>
                    <Link className={style.link} href="/">
                        <IconArrowBack />
                        Домой
                    </Link>
                </div>
            </main>
        </div>
    );
};

export default NotFoundElement;
