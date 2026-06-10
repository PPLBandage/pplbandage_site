'use client';

import { getMe, setUsername } from '@/lib/api/user';
import styles from '@/styles/me/username_set.module.css';
import { IconUserEdit } from '@tabler/icons-react';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import useSWR, { mutate } from 'swr';

const Page = () => {
    const { data } = useSWR('me', () => getMe());

    const [username, setName] = useState<string>('');
    const [error, setError] = useState<string | null>(null);
    const router = useRouter();

    useEffect(() => {
        if (!data) return;
        if (!data.name_conflict) router.push('/me');
    }, [data]);

    const updateName = () => {
        if (!username) return;
        setUsername(username)
            .then(() => {
                mutate('me');
                router.push('/me');
            })
            .catch(e => setError(e.data.message || 'Неизвестная ошибка'));
    };

    return (
        <div className={styles.container}>
            <div className={styles.box}>
                <h3 className={styles.header}>
                    <IconUserEdit />
                    Установите имя пользователя
                </h3>
                <span className={styles.secondary}>
                    <i>
                        Ваше имя пользователя уже занято, пожалуйста, выберите
                        другое. Его можно установить только один раз!
                    </i>
                </span>
                <input
                    className={styles.input}
                    value={username}
                    onChange={e => {
                        setName(e.target.value.slice(0, 30));
                    }}
                    placeholder="Имя пользователя"
                />
                {!!error && (
                    <span className={styles.error}>
                        <i>{error}</i>
                    </span>
                )}
                <button className={styles.btn} onClick={updateName}>
                    Установить
                </button>
            </div>
        </div>
    );
};

export default Page;
