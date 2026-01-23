'use client';

import style_root from '@/styles/admin/page.module.css';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import {
    IconCalendarClock,
    IconCircleDashedCheck,
    IconKey,
    IconUser
} from '@tabler/icons-react';
import useAccess from '@/lib/useAccess';
import { useNextCookie } from 'use-next-cookie';
import { jwtDecode } from 'jwt-decode';

const Admin = () => {
    const access = useAccess();
    const sessionId = useNextCookie('sessionId');

    let username = '...';
    if (sessionId) {
        username = (jwtDecode(sessionId) as { username?: string }).username ?? '...';
    }

    if (!access.length) {
        notFound();
    }

    const superAdmin = access.includes(5);
    const updateUsers = superAdmin || access.includes(3);
    const manageBandages = superAdmin || access.includes(1);
    const manageKV = superAdmin || access.includes(6);
    const manageEvents = superAdmin || access.includes(7);

    if (!updateUsers && !manageBandages && !manageKV) {
        notFound();
    }
    return (
        <main className={style_root.main}>
            <div
                className={style_root.main_container}
                style={{ alignItems: 'flex-start', gap: '1rem' }}
            >
                <h2 style={{ marginTop: 0 }}>Добро пожаловать, {username} 👋</h2>
                {updateUsers && (
                    <Link href="/admin/users" className={style_root.root_button}>
                        <IconUser />
                        Пользователи
                    </Link>
                )}
                {manageBandages && (
                    <Link
                        href="/admin/moderation"
                        className={style_root.root_button}
                    >
                        <IconCircleDashedCheck />
                        Модерация
                    </Link>
                )}
                {manageKV && (
                    <Link href="/admin/kv" className={style_root.root_button}>
                        <IconKey />
                        KV База данных
                    </Link>
                )}
                {manageEvents && (
                    <Link href="/admin/events" className={style_root.root_button}>
                        <IconCalendarClock />
                        Управление событиями
                    </Link>
                )}
            </div>
        </main>
    );
};

export default Admin;
