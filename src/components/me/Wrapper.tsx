'use client';

import React, { CSSProperties, JSX, useEffect, useState } from 'react';
import { Me } from '@/components/me/MeSidebar';
import { redirect, usePathname } from 'next/navigation';
import MinecraftConnect from '@/components/me/MinecraftConnect';
import styles from '@/styles/me/me.module.css';
import {
    IconBrandDiscord,
    IconBrandGoogleFilled,
    IconBrandMinecraft,
    IconBrandTelegram,
    IconBrandTwitch,
    IconLogin
} from '@tabler/icons-react';
import { useNextCookie } from 'use-next-cookie';
import useSWR from 'swr';
import { Users } from '@/types/global';
import { getMe } from '@/lib/api/user';
import { loginMinecraft as loginMinecraftAPI } from '@/lib/api/auth';

const Wrapper = ({ children }: { children: JSX.Element }) => {
    const pathname_full = usePathname();
    const pathname = pathname_full.split('/').reverse()[0];
    const session = useNextCookie('sessionId', 1000);
    const [isLogged, setIsLogged] = useState<boolean>(!!session);

    useEffect(() => {
        setIsLogged(!!session);
    }, [session]);

    if (pathname_full.includes('login') || pathname_full.includes('connect'))
        return children;
    if (pathname !== 'me' && !isLogged) redirect('/me');
    if (!isLogged) return <Login />;

    return <MeLoader>{children}</MeLoader>;
};

const MeLoader = ({ children }: { children: JSX.Element }) => {
    const { data } = useSWR('me', () => getMe());

    if (!data) return null;
    return (
        <Me data={data as Users} self>
            {children}
        </Me>
    );
};

const Login = () => {
    const loginMinecraft = async (code: string): Promise<void> => {
        return new Promise((resolve, reject) => {
            loginMinecraftAPI(code)
                .then(() => {
                    window.location.reload();
                    resolve();
                })
                .catch(reject);
        });
    };

    return (
        <main className={styles.login_main}>
            <div className={styles.login_container}>
                <h1
                    style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '.5rem'
                    }}
                >
                    <IconLogin />
                    Войти через
                </h1>

                <a
                    className={styles.login_button}
                    href={'/api/v1/auth/url/google'}
                    style={
                        {
                            '--color': '#FBBC04',
                            marginBottom: '.5rem'
                        } as CSSProperties
                    }
                >
                    <IconBrandGoogleFilled />
                    Google
                </a>
                <div className={styles.login_through}>
                    <div
                        className={styles.login_through_column}
                        style={{ gridArea: 'cl' }}
                    >
                        <a
                            className={styles.login_button}
                            href={'/api/v1/auth/url/discord'}
                            style={{ '--color': '#5662f6' } as CSSProperties}
                        >
                            <IconBrandDiscord />
                            Discord
                        </a>
                        <a
                            className={styles.login_button}
                            href={'/api/v1/auth/url/telegram'}
                            style={{ '--color': '#24A1DE' } as CSSProperties}
                        >
                            <IconBrandTelegram />
                            Telegram
                        </a>
                    </div>
                    <div
                        className={styles.login_through_column}
                        style={{ gridArea: 'cr' }}
                    >
                        <a
                            className={styles.login_button}
                            href={'/api/v1/auth/url/twitch'}
                            style={{ '--color': '#6441a5' } as CSSProperties}
                        >
                            <IconBrandTwitch />
                            Twitch
                        </a>
                        <MinecraftConnect onInput={loginMinecraft} login>
                            <div
                                className={styles.login_button}
                                style={{ '--color': '#56ff4b' } as CSSProperties}
                            >
                                <IconBrandMinecraft />
                                Minecraft
                            </div>
                        </MinecraftConnect>
                    </div>
                </div>
                <p style={{ color: 'gray', marginBottom: 0 }}>
                    Регистрируясь на сайте вы соглашаетесь с настоящими{' '}
                    <a
                        className={styles.a}
                        href="/tutorials/rules"
                        style={{ color: 'gray' }}
                    >
                        условиями пользования
                    </a>
                </p>
            </div>
        </main>
    );
};

export default Wrapper;
