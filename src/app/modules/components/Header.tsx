"use client";

import { Dispatch, JSX, ReactNode, SetStateAction, useEffect, useState } from "react";
import Styles from "@/app/styles/header.module.css";
import { deleteCookie } from 'cookies-next';
import Link, { LinkProps } from 'next/link';
import Image from 'next/image';
import { useQuery } from "@tanstack/react-query";
import useCookie from "@/app/modules/utils/useCookie";
import * as Interfaces from '@/app/interfaces';

import {
    IconUser,
    IconPlus,
    IconSmartHome,
    IconStack,
    IconLogin,
    IconLogout,
    IconChevronDown,
    IconMenu2,
    IconUserCog,
    IconBooks
} from '@tabler/icons-react';
import IconCropped from '@/app/resources/icon-cropped.svg';
import ApiManager from "../utils/apiManager";
import { useRouter } from "next/navigation";
import { createContext, useContext } from "react";
import ReactCSSTransition from "./CSSTransition";

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
    stars_count: number,
    roles: Interfaces.Category[],
    last_accessed?: Date
}

const ExpandContext = createContext<{ setExpanded: Dispatch<SetStateAction<boolean>> }>(null);
const useExpandContext = () => useContext(ExpandContext);

export const adminRoles = ['managebandages', 'updateusers', 'superadmin']

interface HeaderLinkProps
    extends Omit<React.AnchorHTMLAttributes<HTMLAnchorElement>, "href">,
    LinkProps {
    children: ReactNode;
    href: string;
}

export const HeaderLink: React.FC<HeaderLinkProps> = ({ children, href, ...props }) => {
    const router = useRouter();
    const { setExpanded } = useExpandContext();

    const handleTransition = async (e: React.MouseEvent<HTMLAnchorElement, MouseEvent>) => {
        e.preventDefault();
        setExpanded(false);

        router.push(href);
    };

    return (
        <Link {...props} href={href} onClick={handleTransition}>
            {children}
        </Link>
    );
};

const Header = (): JSX.Element => {
    const cookie = useCookie('sessionId');
    const [logged, setLogged] = useState<boolean>(!!cookie);
    const [expanded, setExpanded] = useState<boolean>(false);

    const { data } = useQuery({
        queryKey: ['userProfile'],
        retry: 5,
        refetchOnWindowFocus: false,
        queryFn: async () => {
            try {
                return await ApiManager.getMe();
            } catch (e) {
                setLogged(false);
                throw e;
            } finally {
                setLoading(false);
            }
        },
    });

    const [loading, setLoading] = useState<boolean>(!!cookie && !data);
    const admin = data?.permissions.some(role => adminRoles.includes(role));

    useEffect(() => {
        setLogged(!!cookie);
    }, [cookie])

    return (
        <ExpandContext.Provider value={{ setExpanded }}>
            {expanded && <div className={Styles.expanding_menu_parent} onClick={() => setExpanded(false)} />}
            <header className={Styles.header}>
                <div className={Styles.header_child} style={{ padding: logged ? '.5rem' : '.9rem' }}>
                    <div style={{ display: "flex", alignItems: "center", flexWrap: "nowrap" }}>
                        <Link href="/" style={{ display: 'flex', alignItems: 'center', textDecoration: 'none' }}>
                            <IconCropped style={{ width: "2.5rem" }} className={Styles.main_icon} />
                            <h1 className={Styles.ppl_name}>Повязки Pepeland</h1>
                        </Link>
                    </div>

                    {logged ?
                        <AvatarMenu data={data} loading={loading} expanded={expanded} expand={setExpanded} /> :
                        <IconMenu2 onClick={() => setExpanded(!expanded)} className={Styles.login_button} />
                    }
                </div>
                <div className={Styles.menu_container}>
                    <ReactCSSTransition
                        state={expanded}
                        timeout={150}
                        classNames={{
                            enter: Styles['menu-enter'],
                            exitActive: Styles['menu-exit-active'],
                        }}
                    >
                        <div className={Styles.menu}>
                            {logged ? <LoggedMenu admin={admin} /> : <UnloggedMenu />}
                        </div>
                    </ReactCSSTransition>
                </div>
            </header>
        </ExpandContext.Provider>
    );
};

const logout = () => {
    ApiManager.logout()
        .then(() => {
            deleteCookie('sessionId');
            window.location.assign('/');
        })
        .catch(console.error);
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
                        src={data?.avatar}
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
            <HeaderLink className={Styles.menu_element} href="/me"><IconUser /><span>Личный кабинет</span></HeaderLink>
            <HeaderLink className={Styles.menu_element} href="/workshop/create"><IconPlus /><span>Создать</span></HeaderLink>
            <hr style={{ border: "1px var(--hr-color) solid", margin: "2px" }}></hr>
            <HeaderLink className={Styles.menu_element} href="/"><IconSmartHome /><span>Главная</span></HeaderLink>
            <HeaderLink className={Styles.menu_element} href="/workshop"><IconStack /><span>Мастерская</span></HeaderLink>
            <HeaderLink className={Styles.menu_element} href="/tutorials"><IconBooks /><span>Туториалы</span></HeaderLink>
            {admin && <HeaderLink className={Styles.menu_element} href="/admin"><IconUserCog /><span>Админ панель</span></HeaderLink>}
            <a className={Styles.menu_element} onClick={() => logout()}><IconLogout /><span>Выйти</span></a>
        </>
    );
}

const UnloggedMenu = () => {
    return (
        <>
            <HeaderLink className={Styles.menu_element} href="/me"><IconLogin /><span>Войти</span></HeaderLink>
            <hr style={{ border: "1px var(--hr-color) solid", margin: "2px" }}></hr>
            <HeaderLink className={Styles.menu_element} href="/"><IconSmartHome /><span>Главная</span></HeaderLink>
            <HeaderLink className={Styles.menu_element} href="/workshop"><IconStack /><span>Мастерская</span></HeaderLink>
            <HeaderLink className={Styles.menu_element} href="/tutorials"><IconBooks /><span>Туториалы</span></HeaderLink >
        </>
    );
}


export default Header;
