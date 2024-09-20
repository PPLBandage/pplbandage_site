"use client";

import { authApi } from "@/app/modules/utils/api.module";
import { useEffect, useState } from "react";
import Styles from "@/app/styles/header.module.css";
import { CSSTransition } from 'react-transition-group';
import { deleteCookie } from 'cookies-next';
import Link from 'next/link';
import Image from 'next/image';
import { useQuery } from "@tanstack/react-query";
import useCookie from "@/app/modules/utils/useCookie.module";

import {
    IconUser,
    IconPlus,
    IconSmartHome,
    IconStack,
    IconLogin,
    IconLogout,
    IconChevronDown,
    IconMenu2,
    IconUserCog
} from '@tabler/icons-react';
import IconCropped from '@/app/resources/icon-cropped.svg';

export interface Query {
    username: string;
    name: string;
    avatar: string;
    discordID: number;
    joined_at: Date;
    banner_color: string;
    has_unreaded_notifications: Boolean,
    permissions: string[],
    profile_theme: number,
    stars_count: number
}

const Header = (): JSX.Element => {
    const cookie = useCookie('sessionId');
    const [logged, setLogged] = useState<boolean>(!!cookie);
    const [expanded, setExpanded] = useState<boolean>(false);

    const { data } = useQuery({
        queryKey: ["userProfile"],
        retry: 5,
        refetchOnWindowFocus: false,
        queryFn: async () => {
            try {
                const res = await authApi.get("/user/me");
                return res.data as Query;
            } catch (e) {
                setLogged(false);
                throw e;
            } finally {
                setLoading(false);
            }
        },
    });

    const [loading, setLoading] = useState<boolean>(!!cookie && !data);
    const admin = ['superadmin', 'updateusers'].some(perm => data?.permissions?.includes(perm));

    useEffect(() => {
        setLogged(!!cookie);
    }, [cookie])

    return (
        <>
            {expanded && <div className={Styles.expanding_menu_parent} onClick={() => setExpanded(false)} />}
            <header className={Styles.header}>
                <div className={Styles.header_child}>
                    <div style={{ display: "flex", alignItems: "center", flexWrap: "nowrap" }}>
                        <Link href="/"><IconCropped style={{ width: "2.5rem" }} className={Styles.main_icon} /></Link>
                        <h1 className={Styles.ppl_name}>Повязки <a style={{ color: "var(--main-text-color)", textDecoration: "none" }} href="https://pepeland.net">Pepeland</a></h1>
                    </div>

                    {logged ?
                        <AvatarMenu data={data} loading={loading} expanded={expanded} expand={setExpanded} /> :
                        <IconMenu2 onClick={() => setExpanded(!expanded)} className={Styles.login_button} />
                    }
                </div>
                <div className={Styles.menu_container}>
                    <CSSTransition
                        in={expanded}
                        timeout={150}
                        classNames={{
                            enter: Styles['menu-enter'],
                            enterActive: Styles['menu-enter-active'],
                            exit: Styles['menu-exit'],
                            exitActive: Styles['menu-exit-active'],
                        }}
                        unmountOnExit>
                        <div className={Styles.menu}>
                            {logged ? <LoggedMenu admin={admin} /> : <UnloggedMenu />}
                        </div>
                    </CSSTransition>
                </div>
            </header>
        </>
    );
};

const logout = () => {
    authApi.delete("user/me").then(() => {
        deleteCookie("sessionId");
        window.location.assign('/');
    });
}

interface AvatarMenuProps {
    data: Query,
    loading: boolean,
    expanded: boolean,
    expand(state: boolean): void
}

const AvatarMenu = ({ data, loading, expanded, expand }: AvatarMenuProps) => {
    return (
        <div style={{ display: 'flex', alignItems: 'center', flexWrap: 'nowrap' }}>
            <div className={`${Styles.avatar_container} ${loading && Styles.placeholders} ${data?.has_unreaded_notifications && Styles.unreaded}`} onClick={() => expand(!expanded)}>
                {data?.avatar &&
                    <Image className={Styles.avatar}
                        src={data?.avatar + '?size=80'}
                        alt=''
                        width={80}
                        height={80}
                        priority={true}
                    />
                }
            </div>
            <IconChevronDown className={`${Styles.expand_arrow} ${expanded && Styles.expand_arrow_rotated}`} onClick={() => expand(!expanded)} />
        </div>
    );
}

const LoggedMenu = ({ admin }: { admin: boolean }) => {
    return (
        <>
            <Link className={Styles.menu_element} href="/me"><IconUser />Личный кабинет</Link>
            <Link className={Styles.menu_element} href="/workshop/create"><IconPlus />Создать</Link>
            <hr style={{ border: "1px var(--hr-color) solid", margin: "2px" }}></hr>
            <Link className={Styles.menu_element} href="/"><IconSmartHome />Главная</Link>
            {admin && <Link className={Styles.menu_element} href="/admin"><IconUserCog />Админ панель</Link>}
            <Link className={Styles.menu_element} href="/workshop"><IconStack />Мастерская</Link>
            <a className={Styles.menu_element} onClick={() => logout()}><IconLogout />Выйти</a>
        </>
    );
}

const UnloggedMenu = () => {
    return (
        <>
            <Link className={Styles.menu_element} href="/me"><IconLogin />Войти</Link>
            <hr style={{ border: "1px var(--hr-color) solid", margin: "2px" }}></hr>
            <Link className={Styles.menu_element} href="/"><IconSmartHome />Главная</Link>
            <Link className={Styles.menu_element} href="/workshop"><IconStack />Мастерская</Link>
        </>
    );
}


export default Header;
