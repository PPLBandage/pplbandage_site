"use client";

import { Cookies, useCookies } from "next-client-cookies";
import useCookie from "@/app/modules/utils/useCookie.module";
import { useEffect, useRef, useState } from "react";
import style_root from '@/app/styles/admin/page.module.css';
import { redirect, useRouter } from "next/navigation";
import Header, { Query } from "@/app/modules/components/header.module";
import { authApi } from "@/app/modules/utils/api.module";
import AdaptiveGrid from "../modules/components/adaptiveGrid.module";
import { SlideButton } from "../modules/components/nick_search.module";
import { Fira_Code } from "next/font/google";
import Link from "next/link";

const fira = Fira_Code({ subsets: ["latin"] });

interface UserAdmins {
    id: number,
    username: string,
    name: string,
    joined_at: Date,
    discord_id: number,
    banned: boolean,
    permissions: string[]
}

const Admin = () => {
    const logged = useCookie('sessionId');
    const cookies = useRef<Cookies>(useCookies());
    const [users, setUsers] = useState<UserAdmins[]>([]);
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
        authApi.get('user/me').then((response) => {
            if (response.status === 200) {
                const data = response.data as Query;
                if (data.permissions.every((perm) => perm === 'default')) {
                    router.replace('/');
                    return;
                }

                if (data.permissions.includes('updateusers') || data.permissions.includes('superadmin')) {
                    authApi.get('/users').then((response) => {
                        response.status === 200 && setUsers(response.data as UserAdmins[]);
                    })
                }
            }
        })
    }, [])

    const UsersEl = users.map((user) => {
        return (
            <div key={user.id} className={style_root.user_card}>
                <div style={{ display: 'flex', flexDirection: 'column' }}>
                    <Link href={`/users/${user.username}`} className={style_root.name}>{user.name}</Link>
                    <Link href={`https://discord.com/users/${user.discord_id}`} className={style_root.username}>{user.username}</Link>
                    <p className={`${style_root.did} ${fira.className}`}>{user.discord_id}</p>
                </div>
                <div>
                    <SlideButton label='Banned' strict={true} onChange={(value) => {
                        authApi.put(`/users/${user.username}`, { banned: value }).then((response) => {
                            if (response.status !== 200) alert(`${response.data.message} ${response.status}`);
                        })
                    }} defaultValue={user.banned} disabled={!user.permissions.every((perm) => perm === 'default')} />
                </div>
            </div>
        );
    })

    return (
        <body>
            <Header />
            <main className={style_root.main}>
                <div className={style_root.main_container}>
                    {
                        UsersEl.length !== 0 &&
                        <>
                            <h2>Пользователи</h2>
                            <AdaptiveGrid child_width={350} className={style_root}>{UsersEl}</AdaptiveGrid>
                        </>
                    }
                </div>
            </main>
        </body>
    );
}

export default Admin;