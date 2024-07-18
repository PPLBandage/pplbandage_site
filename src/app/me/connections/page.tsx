"use client";

import React, { use, useEffect } from 'react';
import { useState, useRef } from 'react';
import { useQuery } from "@tanstack/react-query";
import { authApi } from "@/app/api.module";
import { redirect, usePathname, useRouter } from "next/navigation";
import Style from "../../styles/me/connections.module.css";
import Header from "../../modules/header.module";
import useCookie from '../../modules/useCookie.module';
import { Cookies, useCookies } from 'next-client-cookies';
import Image from 'next/image';
import { Me } from '@/app/modules/me.module';
import { Fira_Code } from "next/font/google";
import { SlideButton } from '@/app/modules/nick_search.module';
import { formatDate } from '@/app/modules/card.module';
const fira = Fira_Code({ subsets: ["latin"] });

interface ConnectionResponse {
    statusCode: number,
    discord?: {
        user_id: number,
        username: string,
        name: string,
        connected_at: Date,
        avatar: string
    },
    minecraft?: {
        nickname: string,
        uuid: string,
        last_cached: number,
        head: string,
        valid: boolean,
        autoload: boolean
    }
}

const b64Prefix = "data:image/png;base64,";

const Main = () => {
    const pathname = usePathname();
    const cookies = useRef<Cookies>(useCookies());
    const logged = useCookie('sessionId');
    const [isLogged, setIsLogged] = useState<boolean>(cookies.current.get('sessionId') != undefined);
    const [loaded, setLoaded] = useState<boolean>(false);
    const [connected, setConnected] = useState<boolean>(false);

    const [valid, setValid] = useState<boolean>(false);
    const [autoload, setAutoload] = useState<boolean>(false);

    const { data, refetch } = useQuery({
        queryKey: ["userConnections"],
        retry: false,
        queryFn: async () => {
            const res = await authApi.get("users/me/connections", {withCredentials: true, validateStatus: () => true});
            const data = res.data as ConnectionResponse;
            
            setConnected(data.minecraft !== null);
            setLoaded(true);
            setValid(data?.minecraft?.valid);
            setAutoload(data?.minecraft?.autoload);
            return data;
        },
    });

    useEffect(() => {
        if (!logged) {
            redirect('/me');
        }
    }, [logged]);

    return (
    <body>
        <Header/>
        {isLogged &&
            <Me>
                <div className={Style.main} style={loaded ? {opacity: "1", transform: "translateY(0)"} : {opacity: "0", transform: "translateY(50px)"}}>
                    <div className={Style.container}>
                        <h3><Image src="/static/icons/discord.svg" alt="" width={32} height={32} style={{marginRight: ".4rem", borderRadius: 0}}/>Discord аккаунт</h3>
                        <div className={Style.discord_container}>
                            {data?.discord && 
                                <Image src={data.discord.avatar + "?size=64"} alt="" width={64} height={64} style={{borderRadius: "50%"}} className={Style.discord_avatar} />
                            }
                            <div className={Style.discord_name_container}>
                                <h1>{data?.discord.name}</h1>
                                <p className={fira.className}>{data?.discord.username}</p>
                            </div>
                        </div>
                        <p style={{margin: 0}}>с {data?.discord && formatDate(new Date(data?.discord.connected_at))}</p>
                    </div>

                    <div className={Style.container}>
                        <h3><Image src="/static/icons/block.svg" alt="" width={32} height={32} style={{marginRight: ".4rem"}}/>Minecraft аккаунт</h3>
                        {connected ? <>
                            <div className={Style.head_container}>
                                {data && <Image src={b64Prefix + data?.minecraft.head} alt="" width={64} height={64} />}
                                <div className={Style.name_container}>
                                    <p className={Style.name}>{data?.minecraft.nickname}</p>
                                    <p className={`${Style.uuid} ${fira.className}`}>{data?.minecraft.uuid}</p>
                                </div>
                            </div>
                            <div className={Style.checkboxes}>
                                <SlideButton value={valid} strict={true} onChange={(val) => {
                                    authApi.put('users/me/connections/minecraft/set_valid', {}, {params: {
                                        state: val
                                    }}).then((response) => {
                                        if (response.status == 200){
                                            setValid((response.data as {new_data: boolean}).new_data);
                                        }
                                    })
                                }} label='Отображать ник в поиске' />
                                <SlideButton value={autoload} strict={true} onChange={(val) => {
                                    authApi.put('users/me/connections/minecraft/set_autoload', {}, {params: {
                                        state: val
                                    }}).then((response) => {
                                        if (response.status == 200){
                                            setAutoload((response.data as {new_data: boolean}).new_data);
                                        }
                                    })
                                }} label='Автоматически устанавливать скин в редакторе'/>
                                    
                            </div>
                            <div className={Style.checkboxes}>
                                <span>Последний раз кэшировано {formatDate(new Date(data?.minecraft?.last_cached))}</span>
                                <button className={Style.unlink} onClick={() => {
                                    const load_icon = document.getElementById('refresh');
                                    load_icon.style.animation = `${Style.loading} infinite 1s linear`;
                                    authApi.post("users/me/connections/minecraft/cache/purge").then((response) => {
                                        if (response.status === 200) {
                                            refetch();
                                            return;
                                        }
                                        alert(response.data.message);
                                    }).finally(() => {
                                        load_icon.style.animation = null;
                                    })
                                }}><img alt="" src="/static/icons/refresh.svg" style={{width: "1.5rem"}} id="refresh" />Обновить кэш</button>

                                <button className={Style.unlink} onClick={() => {
                                    const confirmed = confirm("Отвязать учётную запись Minecraft? Вы сможете в любое время привязать ее обратно.");
                                    if (confirmed) {
                                        authApi.delete('users/me/connections/minecraft').then((response) => {
                                            if (response.status === 200) {
                                                refetch();
                                                return;
                                            }
                                        })
                                    }
                                }}><img alt="" src="/static/icons/plus.svg" style={{width: "1.8rem", transform: "rotate(45deg)"}}/>Отвязать</button>
                            </div>
                        </> : <>
                            <p style={{margin: 0}}>Привяжите свою учётную запись Minecraft к учетной записи PPLBandage для управления кешем скинов и настройками видимости 
                                вашего никнейма в поиске.<br/>Зайдите на Minecraft
                                сервер <span style={{textDecoration: "underline", cursor: "pointer", fontWeight: "600"}} onClick={() => {
                                    navigator.clipboard?.writeText("oauth.pplbandage.ru");
                                    }
                                }>oauth.pplbandage.ru</span> (версия 1.8-текущая) и получите там 6-значный код.</p>

                            <div>
                                <div className={Style.code_container}>
                                    <input placeholder="Введите 6-значный код"type='number' id='code' className={Style.code_input} onChange={e => {
                                        const target = document.getElementById('code') as HTMLInputElement;
                                        if (target.value.length > 6) target.value = target.value.slice(0, 6)}}/>
                                    <button className={Style.code_send} onClick={e => {
                                            const target = document.getElementById('code') as HTMLInputElement;
                                            if (target.value.length != 6) return;

                                            authApi.post(`users/me/connections/minecraft/connect/${target.value}`).then((response) => {
                                                if (response.status === 200) {
                                                    refetch();
                                                    return;
                                                }

                                                const data = response.data as {message_ru: string};
                                                const err = document.getElementById('error') as HTMLParagraphElement;
                                                err.innerHTML = data.message_ru;
                                            })
                                        }
                                    }>Отправить</button>
                                </div>
                                <p style={{margin: 0, color: "#dd0f0f", marginTop: "5px"}} id="error"></p>
                            </div>
                        </>}
                    </div>
                </div>
            </Me>
        }
    </body>
    );
}

export default Main;