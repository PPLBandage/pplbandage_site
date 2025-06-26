'use client';

import style_root from '@/styles/admin/page.module.css';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import { IconCircleDashedCheck, IconUser } from '@tabler/icons-react';
import useAccess from '@/lib/useAccess';

const Admin = () => {
    const access = useAccess();
    if (!access.length) {
        notFound();
    }

    const superAdmin = access.includes(5);
    const updateUsers = superAdmin || access.includes(3);
    const manageBandages = superAdmin || access.includes(1);

    if (!updateUsers && !manageBandages) {
        notFound();
    }
    return (
        <main className={style_root.main}>
            <div
                className={style_root.main_container}
                style={{ alignItems: 'flex-start', gap: '1rem' }}
            >
                {updateUsers && (
                    <Link
                        href="/admin/users"
                        className={style_root.root_button}
                    >
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
            </div>
        </main>
    );
};

export default Admin;
