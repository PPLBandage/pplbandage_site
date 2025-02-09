'use client';

import React, { ChangeEvent, useEffect } from 'react';
import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { redirect } from 'next/navigation';
import Style from '@/app/styles/me/connections.module.css';
import Style_themes from '@/app/styles/me/themes.module.css';
import Style_safety from '@/app/styles/me/safety.module.css';
import useCookie from '@/app/modules/utils/useCookie';
import Image from 'next/image';
import { Me } from '@/app/modules/components/MeSidebar';
import { Fira_Code } from 'next/font/google';
import { formatDate, formatDateHuman } from '@/app/modules/components/Card';
import IconSvg from '@/app/resources/icon.svg';
import {
    IconUser,
    IconBrandDiscord,
    IconPalette,
    IconX,
    IconRefresh,
    IconShield,
    IconDeviceMobile,
    IconDeviceDesktop,
    IconBrandMinecraft,
    IconPlugConnected
} from '@tabler/icons-react';
import { timeStamp } from '@/app/modules/utils/time';
import style_workshop from '@/app/styles/workshop/page.module.css';
import SlideButton from '@/app/modules/components/SlideButton';
import ApiManager from '@/app/modules/utils/apiManager';
import { Session } from '@/app/interfaces';
import { setTheme } from './setTheme';
import MinecraftConnect from '@/app/modules/components/MinecraftConnect';
import themes from '@/app/themes';
const fira = Fira_Code({ subsets: ['latin'] });

export interface SettingsResponse {
    statusCode: number;
    public_profile: boolean;
    can_be_public: boolean;
    connections: {
        discord: {
            user_id: number;
            username: string;
            name: string;
            connected_at: Date;
            avatar: string;
        };
        minecraft?: {
            nickname: string;
            uuid: string;
            last_cached: number;
            head: string;
            valid: boolean;
            autoload: boolean;
        };
    };
}

const b64Prefix = 'data:image/png;base64,';

const Page = () => {
    const [loaded, setLoaded] = useState<boolean>(false);
    const logged = useCookie('sessionId');
    if (!logged) redirect('/me');

    useEffect(() => {
        if (!logged) {
            redirect('/me');
        }
    }, [logged]);

    const { data, refetch } = useQuery({
        queryKey: ['userConnections'],
        retry: false,
        queryFn: async () => {
            const res = await ApiManager.getMeSettings().catch(console.error);
            setLoaded(true);
            return res;
        }
    });

    return (
        <main>
            {logged && (
                <Me>
                    <div
                        id="sidebar"
                        className={Style.main}
                        style={
                            loaded
                                ? { opacity: '1', transform: 'none' }
                                : { opacity: '0', transform: 'translateY(50px)' }
                        }
                    >
                        {data && (
                            <>
                                <UserSettings data={data} />
                                <Connections data={data} refetch={refetch} />
                                <Themes />
                                <Safety />
                            </>
                        )}
                    </div>
                </Me>
            )}
        </main>
    );
};

const UserSettings = ({ data }: { data: SettingsResponse }) => {
    return (
        <div className={Style.container}>
            <h3>
                <IconUser width={26} height={26} />
                Настройки аккаунта
            </h3>
            <SlideButton
                label="Публичный профиль"
                defaultValue={data.can_be_public ? data.public_profile : false}
                onChange={(state) => ApiManager.setPublicProfile({ state })}
                disabled={!data.can_be_public}
                loadable
                strict
            />
        </div>
    );
};

const Connections = ({ data, refetch }: { data: SettingsResponse; refetch(): void }) => {
    const refreshMinecraft = () => {
        const load_icon = document.getElementById('refresh');
        load_icon.style.animation = `${Style.loading} infinite 1s reverse ease-in-out`;

        ApiManager.purgeSkinCache()
            .then(refetch)
            .catch((response) => alert(response.data.message))
            .finally(() => (load_icon.style.animation = null));
    };

    const disconnect = () => {
        const confirmed = confirm('Отвязать учётную запись Minecraft? Вы сможете в любое время привязать ее обратно.');
        if (!confirmed) return;

        ApiManager.disconnectMinecraft().then(refetch).catch(console.error);
    };

    const setValidAPI = (state: boolean): Promise<void> => {
        return new Promise((resolve, reject) => {
            ApiManager.setMinecraftVisible({ state })
                .then(() => resolve())
                .catch(reject);
        });
    };

    const setAutoloadAPI = (state: boolean): Promise<void> => {
        return new Promise((resolve, reject) => {
            ApiManager.setMinecraftAutoload({ state })
                .then(() => resolve())
                .catch(reject);
        });
    };

    const connectMinecraft = async (code: string): Promise<void> => {
        try {
            await ApiManager.connectMinecraft(code);
            setTimeout(refetch, 150);
        } catch (error) {
            throw error;
        }
    };

    return (
        <>
            <div className={Style.container}>
                <h3>
                    <IconBrandDiscord width={32} height={32} />
                    Discord аккаунт
                </h3>
                <div className={Style.discord_container}>
                    {data.connections?.discord && (
                        <Image
                            src={data.connections?.discord.avatar}
                            alt="avatar"
                            width={64}
                            height={64}
                            style={{ borderRadius: '50%' }}
                            className={Style.discord_avatar}
                        />
                    )}
                    <div className={Style.discord_name_container}>
                        <h1>{data.connections?.discord?.name || data.connections.discord.username}</h1>
                        <p>
                            Подключено{' '}
                            {data.connections?.discord &&
                                formatDateHuman(new Date(data.connections?.discord?.connected_at))}
                        </p>
                    </div>
                </div>
            </div>

            <div className={Style.container}>
                <h3>
                    <IconBrandMinecraft width={32} height={32} />
                    Minecraft аккаунт
                </h3>
                {!!data.connections?.minecraft ? (
                    <>
                        <div className={Style.head_container}>
                            {data && (
                                <Image
                                    src={b64Prefix + data.connections?.minecraft.head}
                                    alt=""
                                    width={64}
                                    height={64}
                                />
                            )}
                            <div className={Style.name_container}>
                                <p className={Style.name}>{data.connections?.minecraft.nickname}</p>
                                <p className={`${Style.uuid} ${fira.className}`}>{data.connections?.minecraft.uuid}</p>
                            </div>
                        </div>
                        <div className={Style.checkboxes}>
                            <SlideButton
                                label="Отображать ник в поиске"
                                defaultValue={data.connections?.minecraft?.valid}
                                strict={true}
                                loadable={true}
                                onChange={setValidAPI}
                            />
                            <SlideButton
                                label="Автоматически устанавливать скин в редакторе"
                                defaultValue={data.connections?.minecraft?.autoload}
                                strict={true}
                                loadable={true}
                                onChange={setAutoloadAPI}
                            />
                        </div>
                        <div className={Style.checkboxes}>
                            <span>
                                Последний раз кэшировано{' '}
                                <b>{formatDateHuman(new Date(data.connections.minecraft.last_cached), true)}</b>
                            </span>
                            <button className={Style.unlink} onClick={refreshMinecraft}>
                                <IconRefresh style={{ width: '1.8rem' }} id="refresh" />
                                Обновить кэш
                            </button>

                            <button className={Style.unlink} onClick={disconnect}>
                                <IconX style={{ width: '1.8rem' }} />
                                Отвязать
                            </button>
                        </div>
                    </>
                ) : (
                    <>
                        <p style={{ margin: 0 }}>
                            Подключите свой аккаунт Minecraft, чтобы управлять кэшем скинов и настройками видимости
                            вашего никнейма в поиске.
                        </p>
                        <MinecraftConnect onInput={connectMinecraft}>
                            <button className={Style.unlink} style={{ width: '100%' }}>
                                <IconPlugConnected style={{ width: '1.8rem' }} />
                                Подключить
                            </button>
                        </MinecraftConnect>
                    </>
                )}
            </div>
        </>
    );
};

const Themes = () => {
    const themeCookie = useCookie('theme_main');
    const [themeState, setThemeState] = useState<string>(themeCookie || 'default');

    useEffect(() => setThemeState(themeCookie), [themeCookie]);

    const change_theme = (name: string) => {
        setThemeState(name);
        setTheme(name);
    };

    const themesEl = Object.entries(themes).map((entry) => (
        <Theme
            key={entry[0]}
            data={{
                name: entry[0],
                title: entry[1].title,
                ...entry[1].data
            }}
            theme={themeState}
            onChange={change_theme}
        />
    ));

    return (
        <div className={Style.container} style={{ paddingBottom: 'calc(1rem - 10px)' }}>
            <h3>
                <IconPalette width={24} height={24} />
                Внешний вид
            </h3>
            <div className={Style_themes.parent}>{themesEl}</div>
        </div>
    );
};

interface ThemeProps {
    name: string;
    title: string;
    '--main-bg-color': string;
    '--main-card-color': string;
    '--main-element-color': string;
}

const Theme = ({ data, theme, onChange }: { data: ThemeProps; theme: string; onChange(val: string): void }) => {
    const change = (evt: ChangeEvent) => {
        const target = evt.target as HTMLInputElement;
        target.checked && onChange(data.name);
    };

    return (
        <div onClick={() => onChange(data.name)} style={{ cursor: 'pointer' }} className={Style_themes.clickable}>
            <div style={{ backgroundColor: data['--main-bg-color'] }} className={Style_themes.background}>
                <div style={{ backgroundColor: data['--main-card-color'] }} className={Style_themes.card}>
                    <div style={{ backgroundColor: data['--main-element-color'] }} className={Style_themes.icon} />
                    <div className={Style_themes.text_container}>
                        <div style={{ backgroundColor: data['--main-element-color'], width: '80%' }} />
                        <div style={{ backgroundColor: data['--main-element-color'] }} />
                    </div>
                </div>
            </div>
            <div className={Style_themes.footer}>
                <input type="radio" name="theme" id={data.name} checked={theme === data.name} onChange={change} />
                <label htmlFor={data.name}>{data.title}</label>
            </div>
        </div>
    );
};

const moveToStart = (arr: Session[]) => {
    const filteredArray = arr.filter((el) => !el.is_self);
    const element = arr.find((el) => el.is_self);
    if (!element) return arr;
    filteredArray.unshift(element);
    return filteredArray;
};

const Safety = () => {
    const [loading, setLoading] = useState<boolean>(true);
    const [sessions, setSessions] = useState<Session[]>([]);

    useEffect(() => {
        ApiManager.getSessions()
            .then((data) => {
                setSessions(
                    moveToStart(
                        data.sort(
                            (session1, session2) =>
                                new Date(session2.last_accessed).getTime() - new Date(session1.last_accessed).getTime()
                        )
                    )
                );
                setLoading(false);
            })
            .catch(console.error);
    }, []);

    const logoutSession = (session_id: number) => {
        if (!confirm(`Выйти с этого устройства?`)) return;
        ApiManager.logoutSession(session_id)
            .then(() => setSessions(sessions.filter((session_) => session_.id !== session_id)))
            .catch((response) => alert(response.data.message));
    };

    const logoutSessionAll = () => {
        if (!confirm('Выйти со всех устройств, кроме этого?')) return;
        ApiManager.logoutAllSessions()
            .then(() => setSessions(sessions.filter((session_) => session_.is_self)))
            .catch((response) => alert(response.data.message));
    };

    const sessions_elements = sessions.map((session) => (
        <div key={session.id} className={Style_safety.container}>
            <div className={Style_safety.session}>
                <h2 className={Style_safety.header}>
                    {session.is_mobile ? <IconDeviceMobile /> : <IconDeviceDesktop />}
                    {session.browser} {session.browser_version} {session.is_self && <p>Это устройство</p>}
                </h2>
                <p className={Style_safety.last_accessed} title={formatDate(new Date(session.last_accessed))}>
                    Последний доступ {timeStamp(new Date(session.last_accessed).getTime() / 1000)}
                </p>
            </div>
            {!session.is_self && (
                <button className={Style_safety.button} onClick={(_) => logoutSession(session.id)}>
                    <IconX />
                </button>
            )}
        </div>
    ));

    return (
        <div className={Style.container}>
            <h3>
                <IconShield width={24} height={24} />
                Безопасность
            </h3>
            <h4 style={{ margin: 0 }}>Все устройства</h4>
            <div className={Style_safety.parent}>
                {loading ? (
                    <IconSvg width={86} height={86} className={style_workshop.loading} />
                ) : (
                    <>
                        {sessions_elements}
                        {sessions.length > 1 && (
                            <button className={Style.unlink} onClick={logoutSessionAll}>
                                <IconX style={{ width: '1.8rem' }} />
                                Выйти со всех устройств
                            </button>
                        )}
                    </>
                )}
            </div>
        </div>
    );
};

export default Page;
