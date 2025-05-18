'use client';

import { useEffect, useState } from 'react';
import style_root from '@/styles/admin/page.module.css';
import { notFound, redirect, useRouter } from 'next/navigation';
import { adminRoles, Query } from '@/components/Header';
import { SimpleGrid } from '@/components/AdaptiveGrid';
import { Fira_Code } from 'next/font/google';
import Link from 'next/link';
import SlideButton from '@/components/SlideButton';
import ApiManager from '@/lib/apiManager';
import { UserAdmins } from '@/types/global.d';
import { IconSearch } from '@tabler/icons-react';
import { useCookiesServer, useNextCookie } from 'use-next-cookie';
import { Paginator } from '@/components/Paginator';

const fira = Fira_Code({ subsets: ['latin'] });

const Search = ({ onSearch }: { onSearch(val: string): void }) => {
    const [search, setSearch] = useState<string>('');

    return (
        <div className={style_root.search_main}>
            <input
                onChange={e => setSearch(e.target.value)}
                onKeyUp={e => {
                    if (e.code === 'Enter' || e.code === 'NumpadEnter') {
                        onSearch(search);
                    }
                }}
                className={style_root.search_input}
                placeholder="Name / ID"
            />
            <button
                className={style_root.search_button}
                onClick={() => onSearch(search)}
            >
                <IconSearch width={20} height={20} />
            </button>
        </div>
    );
};

const ForceRegister = () => {
    const [id, setId] = useState<string>('');

    const register = () => {
        if (id === '') return;

        ApiManager.forceRegister(id)
            .then(() => window.location.reload())
            .catch(e => alert(e.data.message));
    };

    return (
        <div className={style_root.search_main}>
            <input
                onChange={e => setId(e.target.value)}
                className={style_root.search_input}
                placeholder="Discord ID"
            />
            <button
                className={style_root.search_button}
                onClick={() => register()}
                style={{ width: 'auto', fontFamily: 'inherit' }}
            >
                Register
            </button>
        </div>
    );
};

const Users = () => {
    const [users, setUsers] = useState<UserAdmins['data']>([]);
    const [userQuery, setQuery] = useState<string>('');
    const [page, setPage] = useState<number>(0);
    const [totalCount, setTotalCount] = useState<number>(0);

    useEffect(() => {
        ApiManager.getUsers(page, 48, userQuery)
            .then(u => {
                setUsers(u.data);
                setTotalCount(u.totalCount);
            })
            .catch(console.error);
    }, [userQuery, page]);

    useEffect(() => {
        scrollTo({ top: 0, behavior: 'smooth' });
    }, [page]);

    const updateUser = (
        user: UserAdmins['data'][number],
        data: { banned?: boolean; skip_ppl_check?: boolean }
    ): Promise<void> => {
        return new Promise((resolve, reject) => {
            ApiManager.updateUser(user.username, data)
                .then(resolve)
                .catch(err => {
                    alert(err.data.message);
                    reject();
                });
        });
    };

    const usersEl = users.map(user => {
        return (
            <div key={user.id} className={style_root.user_card}>
                <div className={style_root.name_container}>
                    <Link
                        href={`/users/${user.username}`}
                        className={style_root.name}
                    >
                        {user.name}
                    </Link>
                    <Link
                        href={`https://discord.com/users/${user.discord_id}`}
                        className={style_root.username}
                    >
                        {user.username}
                    </Link>
                    <p className={`${style_root.did} ${fira.className}`}>
                        {user.discord_id}
                    </p>
                </div>
                <div className={style_root.buttons_container}>
                    <SlideButton
                        label="Заблокирован"
                        strict={true}
                        loadable={true}
                        onChange={value => updateUser(user, { banned: value })}
                        defaultValue={user.banned}
                        disabled={
                            !user.permissions.every(perm => perm === 'default')
                        }
                    />

                    <SlideButton
                        label="Пропустить проверку ролей"
                        strict={true}
                        loadable={true}
                        onChange={value =>
                            updateUser(user, { skip_ppl_check: value })
                        }
                        defaultValue={user.skip_ppl_check}
                    />
                </div>
            </div>
        );
    });

    return (
        <div className={style_root.users_container}>
            <h2 style={{ margin: 0 }}>Пользователи ({totalCount})</h2>
            <div className={style_root.register_container}>
                <Search onSearch={setQuery} />
                <ForceRegister />
            </div>
            <Paginator
                total_count={totalCount}
                take={48}
                page={page}
                onChange={setPage}
            />
            <SimpleGrid>{usersEl}</SimpleGrid>
            <Paginator
                total_count={totalCount}
                take={48}
                page={page}
                onChange={setPage}
            />
        </div>
    );
};

const Admin = () => {
    const logged = useNextCookie('sessionId', 1000);
    const cookiesServer = useCookiesServer();
    const [user, setUser] = useState<Query>(null);
    const router = useRouter();

    if (!cookiesServer.get('sessionId')) {
        notFound();
    }

    useEffect(() => {
        if (!logged) {
            redirect('/');
        }
    }, [logged]);

    useEffect(() => {
        ApiManager.getMe()
            .then(data => {
                if (
                    !data?.permissions.some(role => adminRoles.includes(role))
                ) {
                    router.replace('/');
                    return;
                }
                setUser(data);
            })
            .catch(console.error);
    }, []);

    const updateUsers =
        user &&
        (user.permissions.includes('updateusers') ||
            user.permissions.includes('superadmin'));

    return (
        <main className={style_root.main}>
            <div className={style_root.main_container}>
                {updateUsers && <Users />}
            </div>
        </main>
    );
};

export default Admin;
