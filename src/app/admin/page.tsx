"use client";

import { Cookies, useCookies } from "next-client-cookies";
import useCookie from "@/app/modules/utils/useCookie";
import { useEffect, useRef, useState } from "react";
import style_root from '@/app/styles/admin/page.module.css';
import { redirect, useRouter } from "next/navigation";
import { adminRoles, Query } from "@/app/modules/components/Header";
import AdaptiveGrid from "../modules/components/AdaptiveGrid";
import { Fira_Code } from "next/font/google";
import Link from "next/link";
import SlideButton from "../modules/components/SlideButton";
import ApiManager from "../modules/utils/apiManager";
import { UserAdmins } from "../interfaces";
import { IconSearch } from "@tabler/icons-react";

const fira = Fira_Code({ subsets: ["latin"] });

const Search = ({ onSearch }: { onSearch(val: string): void }) => {
    const [search, setSearch] = useState<string>('');

    return (
        <div className={style_root.search_main}>
            <input
                onChange={(e) => setSearch(e.target.value)}
                onKeyUp={(e) => {
                    if (e.code === 'Enter' || e.code === 'NumpadEnter') {
                        onSearch(search)
                    }
                }}
                className={style_root.search_input}
                placeholder="Name / ID"
            />
            <button className={style_root.search_button} onClick={() => onSearch(search)}>
                <IconSearch width={20} height={20} />
            </button>
        </div>
    )
}

const ForceRegister = () => {
    const [id, setId] = useState<string>('');

    const register = () => {
        if (id === '') return;

        ApiManager.forceRegister(id)
            .then(() => window.location.reload())
            .catch(e => alert(e.data.message_ru || e.data.message));
    }

    return (
        <div className={style_root.search_main}>
            <input
                onChange={(e) => setId(e.target.value)}
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
    )
}

const Users = () => {
    const [users, setUsers] = useState<UserAdmins[]>([]);
    const [userQuery, setQuery] = useState<string>('');

    useEffect(() => {
        ApiManager.getUsers(userQuery).then(setUsers).catch(console.error);
    }, [userQuery]);

    const updateUser = (user: UserAdmins, data: { banned?: boolean, skip_ppl_check?: boolean }): Promise<void> => {
        return new Promise((resolve, reject) => {
            ApiManager.updateUser(user.username, data)
                .then(resolve)
                .catch((err) => { alert(err.data.message_ru || err.data.message); reject(); });
        });
    }

    const usersEl = users.map((user) => {
        return (
            <div key={user.id} className={style_root.user_card}>
                <div style={{ display: 'flex', flexDirection: 'column' }}>
                    <Link href={`/users/${user.username}`} className={style_root.name}>{user.name}</Link>
                    <Link href={`https://discord.com/users/${user.discord_id}`} className={style_root.username}>{user.username}</Link>
                    <p className={`${style_root.did} ${fira.className}`}>{user.discord_id}</p>
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '.5rem' }}>
                    <SlideButton
                        label='Заблокирован'
                        strict={true}
                        loadable={true}
                        onChange={value => updateUser(user, { banned: value })}
                        defaultValue={user.banned}
                        disabled={!user.permissions.every((perm) => perm === 'default')} />

                    <SlideButton
                        label='Пропустить проверку ролей'
                        strict={true}
                        loadable={true}
                        onChange={value => updateUser(user, { skip_ppl_check: value })}
                        defaultValue={user.skip_ppl_check} />
                </div>
            </div>
        );
    })

    if (usersEl.length === 0) return null;

    return (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            <h2 style={{ margin: 0 }}>Пользователи ({usersEl.length})</h2>
            <div style={{ display: 'flex', gap: '.5rem', flexWrap: 'wrap' }}>
                <Search onSearch={setQuery} />
                <ForceRegister />
            </div>
            <AdaptiveGrid child_width={350} className={style_root}>{usersEl}</AdaptiveGrid>
        </div>
    );
}

const Admin = () => {
    const logged = useCookie('sessionId');
    const cookies = useRef<Cookies>(useCookies());
    const [user, setUser] = useState<Query>(null);
    const router = useRouter();

    if (!cookies.current.get('sessionId')) {
        redirect('/');
    }

    useEffect(() => {
        if (!logged) {
            redirect('/');
        }
    }, [logged]);

    useEffect(() => {
        ApiManager.getMe().then(data => {
            if (!data?.permissions.some(role => adminRoles.includes(role))) {
                router.replace('/');
                return;
            }
            setUser(data);
        }).catch(console.error);
    }, [])

    const updateUsers = user && (user.permissions.includes('updateusers') || user.permissions.includes('superadmin'));

    return (
        <main className={style_root.main}>
            <div className={style_root.main_container}>
                {updateUsers && <Users />}
            </div>
        </main>
    );
}

export default Admin;