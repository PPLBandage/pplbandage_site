'use client';

import { IconArrowBack } from '@tabler/icons-react';
import Link from 'next/link';
import IconSvgCropped from '@/resources/icon-cropped.svg';
import styles from '@/styles/me/me.module.css';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { httpStatusCodes } from '@/lib/StatusCodes';

const LoginWrapper = ({
    code,
    callback,
    redirect_to = '/me'
}: {
    code: string;
    callback: (code: string) => Promise<void>;
    redirect_to?: string;
}) => {
    const router = useRouter();
    const [loadingStatus, setLoadingStatus] = useState<string>('');

    useEffect(() => {
        if (!code) router.replace(redirect_to);

        callback(code)
            .then(() => router.replace(redirect_to))
            .catch(response => {
                setLoadingStatus(
                    `${response.status}: ${
                        response.data.message || httpStatusCodes[response.status]
                    }`
                );
            });
    }, []);

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

export default LoginWrapper;
