'use client';

import { IconArrowBack } from '@tabler/icons-react';
import Link from 'next/link';
import IconSvgCropped from '@/resources/icon-cropped.svg';
import styles from '@/styles/me/me.module.css';

const LoadingWrapper = ({ loadingStatus }: { loadingStatus: string }) => {
    return (
        <div className={styles.loading_container}>
            <IconSvgCropped
                width={58}
                height={58}
                className={`${!loadingStatus && styles.loading}`}
            />
            <h3>{loadingStatus || 'Загрузка'}</h3>
            <Link
                className={styles.link}
                style={{ visibility: loadingStatus ? 'visible' : 'hidden' }}
                href="/me"
            >
                <IconArrowBack />
                Назад
            </Link>
        </div>
    );
};

export default LoadingWrapper;
