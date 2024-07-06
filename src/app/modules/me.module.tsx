import { useQuery } from "@tanstack/react-query";
import { useEffect, useState } from "react";
import { authApi } from "../api.module";
import { Query } from "./header.module";
import style_sidebar from "../styles/me/sidebar.module.css";
import Image from 'next/image';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { timeStamp } from "./time.module";
import Footer from "./footer.module";
import { useCookies } from 'next-client-cookies';

const Default = ({data, islogged}: {data: Query, islogged: boolean}) => {
    return (
        <div className={style_sidebar.card}>
            <div className={`${style_sidebar.avatar_container} ${!islogged && style_sidebar.placeholders}`}>
                {islogged && <Image src={data?.avatar + "?size=1024"} alt="" width={150} height={150}/>}
            </div>
            <h3>{data?.name}</h3>
            <p className={style_sidebar.username}>{data?.username}</p>
            <div className={style_sidebar.joined}>
                <p>Аккаунт создан <span>{timeStamp((new Date(data?.joined_at).getTime()) / 1000)}</span></p>
                
            </div>
    
            <p className={style_sidebar.uid}>Discord id: {data?.discordID}</p>
        </div>
    );
}

const ImprovedTheme = ({data, islogged}: {data: Query, islogged: boolean}) => {
    return (
        <div className={style_sidebar.background_image_container}>
            <Image src={data?.avatar} alt="" width={255} height={255} className={style_sidebar.background_image}/>
            <div className={`${style_sidebar.card} ${style_sidebar.card_improved}`}>
                <div className={`${style_sidebar.avatar_container} ${!islogged && style_sidebar.placeholders}`}>
                    {islogged && <Image src={data?.avatar + "?size=1024"} alt="" width={150} height={150}/>}
                </div>
                <h3>{data?.name}</h3>
                <p className={style_sidebar.username}>{data?.username}</p>
                <div className={style_sidebar.joined}>
                    <p>Аккаунт создан <span>{timeStamp((new Date(data?.joined_at).getTime()) / 1000)}</span></p>
                    
                </div>
        
                <p className={style_sidebar.uid}>Discord id: {data?.discordID}</p>
            </div>
        </div>
    );
}

export const Me = ({children}: {children: JSX.Element}) => {
    const [islogged, setIsLogged] = useState<boolean>(false);
    const pathname = usePathname();
    const path = pathname.split('/')[pathname.split('/').length - 1];
    const cookies = useCookies();
    const [theme, setTheme] = useState<boolean>(cookies.get('theme') == "1");

    const { data, isLoading, isError } = useQuery({
        queryKey: ["userProfile"],
        retry: 5,
        queryFn: async () => {
            const res = await authApi.get("/users/me", {withCredentials: true});
            return res.data as Query;

        },
    });

    if (!isLoading && !isError && !islogged && data) {
        setIsLogged(true);
    }

    useEffect(() => {
        cookies.set('theme', theme ? '1' : '0');
    }, [theme]);

    return  <div className={style_sidebar.main_container}>
                <div style={islogged ? {opacity: "1", transform: "translateY(0)"} : {}} className={style_sidebar.hidable}>
                    <div className={style_sidebar.main}>
                        <div className={style_sidebar.side}>
                            <div style={{position: 'relative'}}>
                                {theme ? <ImprovedTheme data={data} islogged={islogged} /> : <Default data={data} islogged={islogged} />}
                                <button className={style_sidebar.style_change} onClick={() => setTheme(prev => !prev)}>
                                    <Image src="/static/icons/scenery.svg" alt="" width={16} height={16} />
                                </button>
                            </div>
                            <div className={style_sidebar.card} style={{alignItems: "stretch", gap: ".5rem"}}>
                                <Link href="/me" className={`${style_sidebar.side_butt} ${path == 'me' && style_sidebar.active}`}>
                                    <Image src="/static/icons/list.svg" alt="" width={24} height={24}/>
                                    Мои работы
                                </Link>
                                <Link href="/me/stars" className={`${style_sidebar.side_butt} ${path == 'stars' && style_sidebar.active}`}>
                                    <Image src="/static/icons/star_bw.svg" alt="" width={24} height={24}/>
                                    Избранное
                                </Link>
                                <Link href="/me/notifications" className={`${style_sidebar.side_butt} ${path == 'notifications' && style_sidebar.active}`}>
                                    <Image src="/static/icons/bell.svg" alt="" width={24} height={24}/>
                                    Уведомления
                                </Link>
                                <Link href="/me/connections" className={`${style_sidebar.side_butt} ${path == 'connections' && style_sidebar.active}`}>
                                    <Image src="/static/icons/block.svg" alt="" width={24} height={24}/>
                                    Интеграции
                                </Link>
                        </div>
                        </div>
                        {children}
                    </div>
                    <Footer />
                </div>
            </div>
}
