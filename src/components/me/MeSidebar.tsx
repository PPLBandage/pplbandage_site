'use client';

import { JSX, useState } from 'react';
import style_sidebar from '@/styles/me/sidebar.module.css';
import Image from 'next/image';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { formatDate, numbersTxt, timeStamp } from '@/lib/time';
import Menu from '../ThemeSelect';

import {
    IconSettings,
    IconBell,
    IconStar,
    IconList,
    IconStarFilled,
    IconUser
} from '@tabler/icons-react';
import { TransitionLink } from '@/components/me/AnimatedLink';
import { UserQuery, Users } from '@/types/global';
import { useNextCookie } from 'use-next-cookie';
import { subscribeTo, unsubscribeFrom } from '@/lib/apiManager';

const Subscribers = ({ user, isSelf }: { user: Users; isSelf: boolean }) => {
    const logged = !!useNextCookie('sessionId');
    const [subscribed, setSubscribed] = useState<boolean>(
        !isSelf ? user.is_subscribed : false
    );
    const [subscribers, setSubscribers] = useState<number>(user.subscribers_count);

    const changeSubscription = () => {
        if (isSelf) return;

        (subscribed ? unsubscribeFrom : subscribeTo)(user.username).then(
            setSubscribers
        );
        setSubscribed(prev => !prev);
    };

    const text = subscribed ? 'Отписаться' : 'Подписаться';
    return (
        <div
            className={style_sidebar.card}
            style={{
                gap: '.5rem',
                alignItems: 'stretch',
                boxShadow: '0px 13px 8px 0px rgb(0 0 0 / 20%) inset'
            }}
        >
            <div className={style_sidebar.subscribe_container}>
                {!isSelf && logged ? (
                    <>
                        <div
                            className={style_sidebar.subscribe_count}
                            style={{ borderRight: 'none' }}
                        >
                            <IconUser width={20} height={20} />
                            <span>{subscribers}</span>
                        </div>
                        <button
                            className={style_sidebar.subscribe_button}
                            onClick={changeSubscription}
                        >
                            {text}
                        </button>
                    </>
                ) : (
                    <div
                        className={style_sidebar.subscribe_count}
                        style={{
                            borderRadius: '10px',
                            width: '100%',
                            justifyContent: 'center',
                            padding: '.3rem .5rem'
                        }}
                    >
                        <span>
                            {numbersTxt(subscribers, [
                                'Подписчик',
                                'Подписчика',
                                'Подписчиков'
                            ])}
                        </span>
                    </div>
                )}
            </div>
        </div>
    );
};

export const Me = ({
    children,
    data,
    self
}: {
    children: JSX.Element;
    data: Users;
    self?: boolean;
}) => {
    const [theme, setTheme] = useState<number>(data.profile_theme);

    if (!data) return null;

    return (
        <div className={style_sidebar.main_container}>
            <div className={style_sidebar.hidable}>
                <div className={style_sidebar.main}>
                    <div className={style_sidebar.side}>
                        <div className={style_sidebar.round_container}>
                            <div style={{ position: 'relative' }}>
                                <AvatarHead
                                    data={data}
                                    color={data.banner_color}
                                    theme={theme}
                                />
                                {self && (
                                    <Menu
                                        initialValue={data.profile_theme}
                                        color_available={!!data.banner_color}
                                        onChange={setTheme}
                                    />
                                )}
                            </div>
                            <Subscribers user={data} isSelf={self} />
                        </div>
                        {self && <Pages data={data} />}
                    </div>
                    {children}
                </div>
            </div>
        </div>
    );
};

const AvatarHead = ({
    data,
    theme,
    color
}: {
    data: UserQuery;
    theme: number;
    color?: string;
}) => {
    const avatar =
        process.env.NEXT_PUBLIC_DOMAIN + `/api/v1/avatars/${data?.userID}`;

    let used_color = undefined;
    let image = undefined;
    if (theme === 1) {
        // Fuck this
        const url = `/_next/image?url=${encodeURI(avatar)}&w=256&q=75`;
        image = { backgroundImage: `url("${url}")` };
    } else {
        used_color = {
            backgroundColor: theme === 2 ? color : 'var(--main-card-color)'
        };
    }
    const last_accessed = new Date(data?.last_accessed);

    return (
        <div
            className={
                theme === 1
                    ? style_sidebar.background_image_container
                    : style_sidebar.not_a_background_image_container
            }
            style={image}
        >
            <div
                className={
                    `${style_sidebar.card} ` +
                    `${theme === 1 && style_sidebar.card_improved}`
                }
                style={used_color}
            >
                <div className={style_sidebar.avatar_container}>
                    {theme === 0 && (
                        <Image
                            src={avatar}
                            className={style_sidebar.blurred_avatar}
                            alt=""
                            width={150}
                            height={150}
                            priority={true}
                            draggable={false}
                        />
                    )}
                    <Image
                        src={avatar}
                        alt=""
                        width={150}
                        height={150}
                        priority={true}
                        draggable={false}
                    />
                </div>
                <h3>{data.name}</h3>
                <p className={style_sidebar.username}>
                    {data.username}{' '}
                    {!!data.last_accessed && (
                        <span title={formatDate(last_accessed)}>
                            ({timeStamp(last_accessed.getTime() / 1000)})
                        </span>
                    )}
                </p>

                <p className={style_sidebar.total_stars}>
                    Звёзд: {data.stars_count}
                    <IconStarFilled width={16} height={16} />
                </p>
                <div className={style_sidebar.joined}>
                    <p title={formatDate(new Date(data.joined_at))}>
                        Аккаунт создан{' '}
                        {timeStamp(new Date(data.joined_at).getTime() / 1000)}
                    </p>
                </div>
                <p className={style_sidebar.uid}>
                    Discord id:{' '}
                    <Link
                        href={`https://discord.com/users/${data.discordID}`}
                        className={style_sidebar.discord_id}
                        target="_blank"
                    >
                        {data.discordID}
                    </Link>
                </p>
            </div>
        </div>
    );
};

const Pages = ({ data }: { data: UserQuery }) => {
    const pathname = usePathname();
    const path = pathname.split('/')[pathname.split('/').length - 1];

    return (
        <div
            className={style_sidebar.card}
            style={{
                alignItems: 'stretch',
                gap: '.5rem',
                borderRadius: '10px'
            }}
        >
            <TransitionLink
                href="/me"
                className={`${style_sidebar.side_butt} ${
                    path === 'me' && style_sidebar.active
                }`}
            >
                <IconList />
                Мои работы
            </TransitionLink>
            <TransitionLink
                href="/me/stars"
                className={`${style_sidebar.side_butt} ${
                    path === 'stars' && style_sidebar.active
                }`}
            >
                <IconStar />
                Избранное
            </TransitionLink>
            <TransitionLink
                href="/me/notifications"
                className={`${style_sidebar.side_butt} ${
                    path === 'notifications' && style_sidebar.active
                }`}
            >
                <IconBell
                    fill={
                        data?.has_unreaded_notifications
                            ? 'var(--main-action-color)'
                            : 'none'
                    }
                />
                Уведомления
            </TransitionLink>
            <TransitionLink
                href="/me/settings"
                className={`${style_sidebar.side_butt} ${
                    path === 'settings' && style_sidebar.active
                }`}
            >
                <IconSettings />
                Настройки
            </TransitionLink>
        </div>
    );
};
