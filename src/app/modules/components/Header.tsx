'use client';

import { Dispatch, JSX, SetStateAction, useEffect, useState } from 'react';
import styles from '@/app/styles/header.module.css';
import { deleteCookie } from 'cookies-next';
import Link from 'next/link';
import Image from 'next/image';
import { useQuery } from '@tanstack/react-query';
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
import ApiManager from '../utils/apiManager';
import ReactCSSTransition from './CSSTransition';
import { useNextCookie } from 'use-next-cookie';
import { usePathname } from 'next/navigation';

export interface Query {
    username: string;
    name: string;
    avatar: string;
    discordID: number;
    joined_at: Date;
    banner_color: string;
    has_unreaded_notifications: boolean;
    permissions: string[];
    profile_theme: number;
    stars_count: number;
    roles: Interfaces.Category[];
    last_accessed?: Date;
}

export const adminRoles = ['managebandages', 'updateusers', 'superadmin'];
const Header = (): JSX.Element => {
    const cookie = useNextCookie('sessionId', 1000);
    const path = usePathname();
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
            }
        }
    });
    const admin = data?.permissions.some(role => adminRoles.includes(role));

    useEffect(() => {
        setLogged(!!cookie);
    }, [cookie]);

    useEffect(() => {
        if (expanded) setExpanded(false);
    }, [path]);

    return (
        <>
            {expanded && (
                <div
                    className={styles.expanding_menu_parent}
                    onClick={() => setExpanded(false)}
                />
            )}
            <header className={styles.header}>
                <div
                    className={styles.header_child}
                    style={{ padding: logged ? '.5rem' : '.9rem' }}
                >
                    <div className={styles.site_name_container}>
                        <Link href={'/'} className={styles.root_anchor}>
                            <IconCropped
                                width={40}
                                className={styles.main_icon}
                            />
                            <h1 className={styles.ppl_name}>
                                Повязки Pepeland
                            </h1>
                        </Link>
                    </div>

                    {logged ? (
                        <AvatarMenu
                            data={data}
                            expanded={expanded}
                            expand={setExpanded}
                        />
                    ) : (
                        <IconMenu2
                            onClick={() => setExpanded(prev => !prev)}
                            className={styles.login_button}
                        />
                    )}
                </div>
                <div className={styles.menu_container}>
                    <ReactCSSTransition
                        state={expanded}
                        timeout={150}
                        classNames={{
                            enter: styles.menu_enter,
                            exitActive: styles.menu_exit_active
                        }}
                    >
                        <div className={styles.menu}>
                            {logged ? (
                                <LoggedMenu admin={admin} />
                            ) : (
                                <UnloggedMenu />
                            )}
                        </div>
                    </ReactCSSTransition>
                </div>
            </header>
        </>
    );
};

const AvatarMenu = ({
    data,
    expanded,
    expand
}: {
    data: Query;
    expanded: boolean;
    expand: Dispatch<SetStateAction<boolean>>;
}) => {
    const [loading, setLoading] = useState<boolean>(true);

    return (
        <div className={styles.menu_avatar_parent}>
            <div
                className={
                    `${styles.avatar_container} ` +
                    `${styles.placeholders} ` +
                    `${!loading && styles.placeholders_out} ` +
                    `${data?.has_unreaded_notifications && styles.unreaded}`
                }
                onClick={() => expand(prev => !prev)}
            >
                {data?.avatar && (
                    <Image
                        className={styles.avatar}
                        src={data?.avatar}
                        alt=""
                        width={80}
                        height={80}
                        priority={true}
                        onLoad={() => setLoading(false)}
                    />
                )}
            </div>
            <IconChevronDown
                className={
                    `${styles.expand_arrow} ` +
                    `${expanded && styles.expand_arrow_rotated}`
                }
                onClick={() => expand(prev => !prev)}
            />
        </div>
    );
};

const LoggedMenu = ({ admin }: { admin: boolean }) => {
    const logout = () => {
        ApiManager.logout()
            .then(() => {
                deleteCookie('sessionId');
                window.location.assign('/');
            })
            .catch(console.error);
    };

    return (
        <>
            <Link className={styles.menu_element} href="/me">
                <IconUser />
                <span>Личный кабинет</span>
            </Link>
            <Link className={styles.menu_element} href="/workshop/create">
                <IconPlus />
                <span>Создать</span>
            </Link>
            <hr className={styles.menu_hr} />
            <Link className={styles.menu_element} href="/">
                <IconSmartHome />
                <span>Главная</span>
            </Link>
            <Link className={styles.menu_element} href="/workshop">
                <IconStack />
                <span>Мастерская</span>
            </Link>
            <Link className={styles.menu_element} href="/tutorials">
                <IconBooks />
                <span>Туториалы</span>
            </Link>
            {admin && (
                <Link className={styles.menu_element} href="/admin">
                    <IconUserCog />
                    <span>Админ панель</span>
                </Link>
            )}
            <a className={styles.menu_element} onClick={logout}>
                <IconLogout />
                <span>Выйти</span>
            </a>
        </>
    );
};

const UnloggedMenu = () => {
    return (
        <>
            <Link className={styles.menu_element} href="/me">
                <IconLogin />
                <span>Войти</span>
            </Link>
            <hr className={styles.menu_hr} />
            <Link className={styles.menu_element} href="/">
                <IconSmartHome />
                <span>Главная</span>
            </Link>
            <Link className={styles.menu_element} href="/workshop">
                <IconStack />
                <span>Мастерская</span>
            </Link>
            <Link className={styles.menu_element} href="/tutorials">
                <IconBooks />
                <span>Туториалы</span>
            </Link>
        </>
    );
};

export default Header;
