'use client';

import { SimpleGrid } from '@/components/workshop/AdaptiveGrid';
import { Paginator } from '@/components/workshop/Paginator';
import { Fira_Code } from 'next/font/google';
import style_root from '@/styles/admin/page.module.css';
import { useEffect, useState } from 'react';
import {
    IconBrandDiscord,
    IconBrandGoogleFilled,
    IconBrandMinecraft,
    IconBrandTwitch,
    IconSearch
} from '@tabler/icons-react';
import { UserAdmins } from '@/types/global';
import Link from 'next/link';
import SlideButton from '@/components/SlideButton';
import { notFound } from 'next/navigation';
import useAccess from '@/lib/useAccess';
import { getUsers, updateUser } from '@/lib/api/user';
import { StaticTooltip } from '@/components/Tooltip';

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

const getBitSet = (set: number, bit: number): boolean => Boolean(set & (1 << bit));

const Users = () => {
    const [users, setUsers] = useState<UserAdmins['data']>([]);
    const [userQuery, setQuery] = useState<string>('');
    const [page, setPage] = useState<number>(0);
    const [totalCount, setTotalCount] = useState<number>(0);

    useEffect(() => {
        getUsers(page, 48, userQuery)
            .then(u => {
                setUsers(u.data);
                setTotalCount(u.totalCount);
            })
            .catch(console.error);
    }, [userQuery, page]);

    useEffect(() => {
        scrollTo({ top: 0, behavior: 'smooth' });
    }, [page]);

    const userUpdate = (
        user: UserAdmins['data'][number],
        data: { banned?: boolean; skip_ppl_check?: boolean }
    ): Promise<void> => {
        return new Promise((resolve, reject) => {
            updateUser(user.username, data)
                .then(resolve)
                .catch(err => {
                    alert(err.data.message);
                    reject();
                });
        });
    };

    const usersEl = users.map(user => {
        console.log(user.flags);
        return (
            <div key={user.id} className={style_root.user_card}>
                <div className={style_root.name_container}>
                    <div className={style_root.main_name_container}>
                        <Link
                            href={`/users/${user.username}`}
                            className={style_root.name}
                        >
                            {user.name}
                        </Link>
                        <div style={{ display: 'flex', gap: '.1rem' }}>
                            {getBitSet(user.flags, 2) && (
                                <StaticTooltip title="Discord">
                                    <IconBrandDiscord width={16} height={16} />
                                </StaticTooltip>
                            )}
                            {getBitSet(user.flags, 3) && (
                                <StaticTooltip title="Google">
                                    <IconBrandGoogleFilled width={16} height={16} />
                                </StaticTooltip>
                            )}
                            {getBitSet(user.flags, 4) && (
                                <StaticTooltip title="Twitch">
                                    <IconBrandTwitch width={16} height={16} />
                                </StaticTooltip>
                            )}
                            {getBitSet(user.flags, 5) && (
                                <StaticTooltip title="Minecraft">
                                    <IconBrandMinecraft width={16} height={16} />
                                </StaticTooltip>
                            )}
                        </div>
                    </div>
                    <span className={style_root.username}>{user.username}</span>
                    <p className={`${style_root.did} ${fira.className}`}>
                        {user.id}
                    </p>
                </div>
                <div className={style_root.buttons_container}>
                    <SlideButton
                        label="Заблокирован"
                        strict={true}
                        loadable={true}
                        onChange={value => userUpdate(user, { banned: value })}
                        defaultValue={Boolean(user.flags & 1)}
                        disabled={user.permissions !== 1}
                    />

                    <SlideButton
                        label="Пропустить проверку ролей"
                        strict={true}
                        loadable={true}
                        defaultValue={getBitSet(user.flags, 1)}
                        onChange={value =>
                            userUpdate(user, { skip_ppl_check: value })
                        }
                    />
                </div>
            </div>
        );
    });

    return (
        <div className={style_root.users_container}>
            <h2 style={{ margin: 0 }}>Пользователи ({totalCount})</h2>
            <Search onSearch={setQuery} />
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

const Page = () => {
    const access = useAccess();
    if (!access.length) {
        notFound();
    }

    const superAdmin = access.includes(5);
    if (!superAdmin && !access.includes(3)) {
        notFound();
    }

    return (
        <main className={style_root.main}>
            <div className={style_root.main_container}>
                <Users />
            </div>
        </main>
    );
};

export default Page;
