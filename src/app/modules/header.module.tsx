"use client";

import { authApi } from "./api.module";
import { useEffect, useState } from "react";
import Styles from "@/app/styles/header.module.css";
import { CSSTransition } from 'react-transition-group';
import { deleteCookie } from 'cookies-next';
import Link from 'next/link';
import Image from 'next/image';
import { useQuery } from "@tanstack/react-query";
import useCookie from "./useCookie.module";

export interface Query {
    username: string;
    name: string;
    avatar: string;
    discordID: number;
    joined_at: Date;
    banner_color: string;
    has_unreaded_notifications: Boolean,
    permissions: string[],
    profile_theme: number
}

const Header = (): JSX.Element => {
    const cookie = useCookie('sessionId');
    const [logged, setLogged] = useState<boolean>(!!cookie);
    const [expanded, setExpanded] = useState<boolean>(false);

    const { data } = useQuery({
        queryKey: ["userProfile"],
        retry: 5,
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

    useEffect(() => {
        setLogged(!!cookie);
    }, [cookie])

    return (
        <>
            {expanded && <div className={Styles.expanding_menu_parent} onClick={() => setExpanded(false)} />}
            <header className={Styles.header}>
                <div className={Styles.header_child}>
                    <div style={{ display: "flex", alignItems: "center", flexWrap: "nowrap" }}>
                        <Link href="/"><img alt="" style={{ width: "3rem" }} src="/static/icons/icon-cropped.svg" className={Styles.main_icon} /></Link>
                        <h1 className={Styles.ppl_name}>Повязки <a style={{ color: "var(--main-text-color)", textDecoration: "none" }} href="https://pepeland.net">Pepeland</a></h1>
                    </div>

                    {logged ?
                        <AvatarMenu data={data} loading={loading} expanded={expanded} expand={setExpanded} /> :
                        <img alt="" src="/static/icons/burger-menu.svg" onClick={() => setExpanded(!expanded)} className={Styles.login_button} />
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
                            {logged ? <LoggedMenu /> : <UnloggedMenu />}
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
            <img alt='' src='/static/icons/chevron-down.svg' className={`${Styles.expand_arrow} ${expanded && Styles.expand_arrow_rotated}`} onClick={() => expand(!expanded)} />
        </div>
    );
}

const LoggedMenu = () => {
    return (
        <>
            <Link className={Styles.menu_element} href="/me"><img alt="" style={{ marginLeft: "-2px" }} src="/static/icons/user.svg" />Личный кабинет</Link>
            <Link className={Styles.menu_element} href="/workshop/create"><img alt="" style={{ marginLeft: "-2px" }} src="/static/icons/plus.svg" />Создать</Link>
            <hr style={{ border: "1px var(--hr-color) solid", margin: "2px" }}></hr>
            <Link className={Styles.menu_element} href="/"><img alt="" style={{ marginLeft: "-2px" }} src="/static/icons/home.svg" />Главная</Link>
            <Link className={Styles.menu_element} href="/workshop"><img alt="" style={{ marginLeft: "-2px" }} src="/static/icons/stack.svg" />Мастерская</Link>
            <a className={Styles.menu_element} onClick={() => logout()}><img alt="" src="/static/icons/logout.svg" />Выйти</a>
        </>
    );
}

const UnloggedMenu = () => {
    return (
        <>
            <Link className={Styles.menu_element} href="/me"><img alt="" src="/static/icons/login.svg" />Войти</Link>
            <hr style={{ border: "1px var(--hr-color) solid", margin: "2px" }}></hr>
            <Link className={Styles.menu_element} href="/"><img alt="" style={{ marginLeft: "-2px" }} src="/static/icons/home.svg" />Главная</Link>
            <Link className={Styles.menu_element} href="/workshop"><img alt="" style={{ marginLeft: "-2px" }} src="/static/icons/stack.svg" />Мастерская</Link>
        </>
    );
}


export default Header;
