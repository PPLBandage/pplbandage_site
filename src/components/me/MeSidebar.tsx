'use client';

import { CSSProperties, useEffect, useState } from 'react';
import style_sidebar from '@/styles/me/sidebar.module.css';
import Image from 'next/image';
import { usePathname } from 'next/navigation';
import { formatDate, numbersTxt, timeStamp } from '@/lib/time';
import Menu from '../ThemeSelect';

import {
    IconSettings,
    IconBell,
    IconStar,
    IconList,
    IconStarFilled,
    IconUser,
    IconUserHeart
} from '@tabler/icons-react';
import { UserQuery, Users } from '@/types/global';
import { useNextCookie } from 'use-next-cookie';
import { subscribeTo, unsubscribeFrom } from '@/lib/api/user';
import { getAverageColor, hexToRgb } from '@/lib/colorUtils';
import Link from 'next/link';

const Subscribers = ({ user, isSelf }: { user: Users; isSelf: boolean }) => {
    const logged = !!useNextCookie('sessionId');
    const [subscribed, setSubscribed] = useState<boolean>(
        !isSelf ? user.is_subscribed! : false
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
    children: React.ReactNode;
    data: Users;
    self?: boolean;
}) => {
    const [theme, setTheme] = useState<number>(data.profile_theme);
    const [color, setColor] = useState<string>(data.banner_color);

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
                                    color={color}
                                    theme={theme}
                                />
                                {self && (
                                    <Menu
                                        initialValue={data.profile_theme}
                                        initialColor={color}
                                        onChange={setTheme}
                                        onColorChange={setColor}
                                    />
                                )}
                            </div>
                            <Subscribers user={data} isSelf={self ?? false} />
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
    color: string;
}) => {
    const [bright, setBright] = useState<boolean>(true);
    const avatar = process.env.NEXT_PUBLIC_DOMAIN + `/api/v1/avatars/${data.userID}`;
    const optimized_avatar = `/_next/image?url=${encodeURI(avatar)}&w=256&q=75`;

    let used_color = undefined;
    let image = undefined;
    if (theme === 1) {
        image = { backgroundImage: `url("${optimized_avatar}")` };
    } else {
        used_color = {
            backgroundColor: theme === 2 ? color : 'var(--main-card-color)'
        };
    }
    const last_accessed = new Date(data.last_accessed!);

    const setBrightColor = ({ r, g, b }: { r: number; g: number; b: number }) => {
        setBright(0.299 * r + 0.587 * g + 0.114 * b <= 128);
    };

    useEffect(() => {
        if (theme === 0) {
            setBright(true);
        } else if (theme === 1) {
            getAverageColor(optimized_avatar).then(setBrightColor);
        } else if (theme === 2) {
            const rgb = hexToRgb(color);
            if (!rgb) return;
            setBrightColor(rgb);
        }
    }, [theme, color]);

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
                style={
                    {
                        ...used_color,
                        '--avatar-text-color': bright ? '#fff' : '#101013'
                    } as CSSProperties
                }
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
                <p className={style_sidebar.uid}>User ID: {data.userID}</p>
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
            <Link
                href="/me"
                className={`${style_sidebar.side_butt} ${
                    path === 'me' && style_sidebar.active
                }`}
            >
                <IconList />
                Мои работы
            </Link>
            <Link
                href="/me/stars"
                className={`${style_sidebar.side_butt} ${
                    path === 'stars' && style_sidebar.active
                }`}
            >
                <IconStar />
                Избранное
            </Link>
            <Link
                href="/me/subscriptions"
                className={`${style_sidebar.side_butt} ${
                    path === 'subscriptions' && style_sidebar.active
                }`}
            >
                <IconUserHeart />
                Подписки
            </Link>
            <Link
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
            </Link>
            <Link
                href="/me/settings"
                className={`${style_sidebar.side_butt} ${
                    path === 'settings' && style_sidebar.active
                }`}
            >
                <IconSettings />
                Настройки
            </Link>
            <Link
                href="/me/accounts"
                className={`${style_sidebar.side_butt} ${
                    path === 'accounts' && style_sidebar.active
                }`}
            >
                <IconUser />
                Аккаунты
            </Link>
        </div>
    );
};
