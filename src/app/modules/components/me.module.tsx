import { useQuery } from "@tanstack/react-query";
import { useEffect, useState } from "react";
import { authApi } from "../utils/api.module";
import { Query } from "./header.module";
import style_sidebar from "@/app/styles/me/sidebar.module.css";
import Image from 'next/image';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { timeStamp } from "../utils/time.module";
import Footer from "./footer.module";
import { useCookies } from 'next-client-cookies';
import Menu from "./theme_select.module";
import { Users } from "@/app/users/[name]/page";
import { formatDate } from "./card.module";

import { IconSettings, IconBell, IconStar, IconList, IconStarFilled } from '@tabler/icons-react';

const Default = ({ data, islogged, color }: { data: Query, islogged: boolean, color?: string }) => {
    return (
        <div className={style_sidebar.card} style={{ backgroundColor: color || "var(--main-card-color)" }}>
            <div className={`${style_sidebar.avatar_container} ${!islogged && style_sidebar.placeholders}`}>
                {islogged && data?.avatar && <Image src={data?.avatar + "?size=1024"} alt="" width={150} height={150} priority={true} draggable={false} />}
            </div>
            <h3>{data?.name}</h3>
            <p className={style_sidebar.username}>{data?.username}</p>

            <p className={style_sidebar.total_stars}>Звёзд: {data?.stars_count}<IconStarFilled width={16} height={16} /></p>
            <div className={style_sidebar.joined}>
                <p title={formatDate(new Date(data?.joined_at))}>Аккаунт создан {timeStamp((new Date(data?.joined_at).getTime()) / 1000)}</p>
            </div>
            <p className={style_sidebar.uid}>Discord id: <Link href={`https://discord.com/users/${data?.discordID}`} className={style_sidebar.discord_id} target="_blank">{data?.discordID}</Link></p>
        </div>
    );
}

const ImprovedTheme = ({ data, islogged }: { data: Query, islogged: boolean }) => {
    return (
        <div className={style_sidebar.background_image_container}>
            {islogged && data?.avatar && <Image src={data?.avatar + "?size=512"} alt="" width={512} height={512} className={style_sidebar.background_image} quality={100} priority={true} />}
            <div className={`${style_sidebar.card} ${style_sidebar.card_improved}`}>
                <div className={`${style_sidebar.avatar_container} ${!islogged && style_sidebar.placeholders}`}>
                    {islogged && data?.avatar && <Image src={data?.avatar + "?size=1024"} alt="" width={150} height={150} priority={true} draggable={false} />}
                </div>
                <h3>{data?.name}</h3>
                <p className={style_sidebar.username}>{data?.username}</p>

                <p className={style_sidebar.total_stars}>Звёзд: {data?.stars_count}<IconStarFilled width={16} height={16} /></p>
                <div className={style_sidebar.joined}>
                    <p title={formatDate(new Date(data?.joined_at))}>Аккаунт создан {timeStamp((new Date(data?.joined_at).getTime()) / 1000)}</p>
                </div>
                <p className={style_sidebar.uid}>Discord id: <Link href={`https://discord.com/users/${data?.discordID}`} className={style_sidebar.discord_id} target="_blank">{data?.discordID}</Link></p>
            </div>
        </div>
    );
}

export const Me = ({ children, user_data }: { children: JSX.Element, user_data?: Users }) => {
    const [islogged, setIsLogged] = useState<boolean>(false);
    const pathname = usePathname();
    const path = pathname.split('/')[pathname.split('/').length - 1];
    const [theme, setTheme] = useState<number>(null);

    const { data, isLoading, isError } = useQuery({
        queryKey: [!!user_data?.username ? `user_${user_data?.username}` : `userProfile`],
        retry: 5,
        queryFn: async () => {
            if (!user_data) {
                const res = await authApi.get("/user/me", { withCredentials: true });
                return res.data as Query;
            } else {
                return user_data;
            }

        },
    });
    if (!isLoading && !isError && !islogged && data) {
        setIsLogged(true);
    }

    let background;
    switch (theme ?? user_data?.profile_theme ?? data?.profile_theme) {
        case 1:
            background = <ImprovedTheme data={data as Query} islogged={islogged} />;
            break;
        case 2:
            background = <Default data={data as Query} islogged={islogged} color={data?.banner_color} />;
            break;
        default:
            background = <Default data={data as Query} islogged={islogged} />;
            break;
    }

    return (
        <div className={style_sidebar.main_container}>
            <div style={islogged ? { opacity: "1", transform: "translateY(0)" } : {}} className={style_sidebar.hidable}>
                <div className={style_sidebar.main}>
                    <div className={style_sidebar.side}>
                        {!!data &&
                            <>
                                <div style={{ position: 'relative' }}>
                                    {background}
                                    {!user_data && <Menu initialValue={data?.profile_theme} color_available={!!data?.banner_color} onChange={setTheme} />}
                                </div>
                                {!user_data &&
                                    <div className={style_sidebar.card} style={{ alignItems: "stretch", gap: ".5rem" }}>
                                        <Link href="/me" className={`${style_sidebar.side_butt} ${path == 'me' && style_sidebar.active}`}>
                                            <IconList width={24} height={24} />
                                            Мои работы
                                        </Link>
                                        <Link href="/me/stars" className={`${style_sidebar.side_butt} ${path == 'stars' && style_sidebar.active}`}>
                                            <IconStar width={24} height={24} />
                                            Избранное
                                        </Link>
                                        <Link href="/me/notifications" className={`${style_sidebar.side_butt} ${path == 'notifications' && style_sidebar.active}`}>
                                            <IconBell width={24} height={24} />
                                            Уведомления
                                            {(data as Query)?.has_unreaded_notifications &&
                                                <span style={{
                                                    backgroundColor: '#1bd96a',
                                                    width: '8px',
                                                    height: '8px',
                                                    marginLeft: '5px',
                                                    marginTop: '2px',
                                                    borderRadius: '50%'
                                                }} />
                                            }
                                        </Link>
                                        <Link href="/me/settings" className={`${style_sidebar.side_butt} ${path == 'settings' && style_sidebar.active}`}>
                                            <IconSettings width={24} height={24} />
                                            Настройки
                                        </Link>
                                    </div>
                                }
                            </>
                        }
                    </div>
                    {children}
                </div>
                <Footer />
            </div>
        </div>
    );
}
