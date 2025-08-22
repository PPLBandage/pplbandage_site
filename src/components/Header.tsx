'use client';

import { Dispatch, JSX, SetStateAction, useEffect, useState } from 'react';
import styles from '@/styles/header.module.css';
import { deleteCookie, getCookie } from 'cookies-next/client';
import Link from 'next/link';
import Image from 'next/image';

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
    IconAddressBook,
    IconNews
} from '@tabler/icons-react';
import IconCropped from '@/resources/icon-cropped.svg';
import ReactCSSTransition from './CSSTransition';
import { useNextCookie } from 'use-next-cookie';
import { usePathname } from 'next/navigation';
import useSWR from 'swr';
import { jwtDecode } from 'jwt-decode';
import { getMe, logout } from '@/lib/api/user';

const Header = (): JSX.Element => {
    const cookie = useNextCookie('sessionId', 1000);
    const path = usePathname();
    const [logged, setLogged] = useState<boolean>(!!cookie);
    const [expanded, setExpanded] = useState<boolean>(false);

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
                            <IconCropped width={36} className={styles.main_icon} />
                            <h1 className={styles.ppl_name}>Повязки Pepeland</h1>
                        </Link>
                    </div>

                    {logged ? (
                        <AvatarMenu expanded={expanded} expand={setExpanded} />
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
                            {logged ? <LoggedMenu /> : <UnloggedMenu />}
                        </div>
                    </ReactCSSTransition>
                </div>
            </header>
        </>
    );
};

const AvatarMenu = ({
    expanded,
    expand
}: {
    expanded: boolean;
    expand: Dispatch<SetStateAction<boolean>>;
}) => {
    const { data } = useSWR('me', () => getMe());
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
                {data?.userID && (
                    <Image
                        className={styles.avatar}
                        src={
                            process.env.NEXT_PUBLIC_DOMAIN +
                            `/api/v1/avatars/${data?.userID}`
                        }
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

const LoggedMenu = () => {
    const session = getCookie('sessionId');
    const hasAccessToAdmin = session
        ? (jwtDecode(session) as { access: number }).access > 1
        : false;

    const userLogout = () => {
        logout()
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
            <Link className={styles.menu_element} href="/blog">
                <IconNews />
                <span>Блог</span>
            </Link>
            <Link className={styles.menu_element} href="/contacts">
                <IconAddressBook />
                <span>Контакты</span>
            </Link>
            {hasAccessToAdmin && (
                <Link className={styles.menu_element} href="/admin">
                    <IconUserCog />
                    <span>Админ панель</span>
                </Link>
            )}
            <a className={styles.menu_element} onClick={userLogout}>
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
            <Link className={styles.menu_element} href="/blog">
                <IconNews />
                <span>Блог</span>
            </Link>
            <Link className={styles.menu_element} href="/contacts">
                <IconAddressBook />
                <span>Контакты</span>
            </Link>
        </>
    );
};

export default Header;
