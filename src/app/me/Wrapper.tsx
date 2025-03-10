'use client';

import React, { CSSProperties, JSX, useEffect, useState } from 'react';
import { Query } from '../modules/components/Header';
import ApiManager from '../modules/utils/apiManager';
import { Me } from '../modules/components/MeSidebar';
import {
    redirect,
    usePathname,
    useRouter,
    useSearchParams
} from 'next/navigation';
import { httpStatusCodes } from '../modules/utils/StatusCodes';
import RolesDialog from '../modules/components/RolesDialog';
import MinecraftConnect from '../modules/components/MinecraftConnect';
import styles from '@/app/styles/me/me.module.css';
import Link from 'next/link';
import { IconArrowBack, IconBrandMinecraft } from '@tabler/icons-react';
import IconSvgCropped from '@/app/resources/icon-cropped.svg';
import { useNextCookie } from 'use-next-cookie';

const Wrapper = ({ children }: { children: JSX.Element }) => {
    const searchParams = useSearchParams();
    const pathname = usePathname().split('/').reverse()[0];
    const code = searchParams.get('code');
    const session = useNextCookie('sessionId', 1000);
    const [isLogged, setIsLogged] = useState<boolean>(!!session);

    useEffect(() => {
        setIsLogged(!!session);
    }, [session]);

    if (pathname === 'login') return children;
    if (pathname !== 'me' && !isLogged) redirect('/me');
    if (code) return <Loading code={code} callback={setIsLogged} />;
    if (!isLogged) return <Login />;

    return <MeLoader>{children}</MeLoader>;
};

const MeLoader = ({ children }: { children: JSX.Element }) => {
    const [userData, setUserData] = useState<Query>(null);

    useEffect(() => {
        ApiManager.getMe().then(setUserData).catch(console.log);
    }, []);

    if (!userData) return null;
    return (
        <Me data={userData} self>
            {children}
        </Me>
    );
};

const Loading = ({
    code,
    callback
}: {
    code: string;
    callback: (v: boolean) => void;
}) => {
    const router = useRouter();
    const [loadingStatus, setLoadingStatus] = useState<string>('');

    useEffect(() => {
        ApiManager.loginDiscord(code)
            .then(() => {
                callback(true);
                router.replace('/me');
            })
            .catch(response => {
                setLoadingStatus(
                    `${response.status}: ${
                        response.data.message ||
                        httpStatusCodes[response.status]
                    }`
                );
            });
    }, []);

    return (
        <div className={styles.loading_container}>
            <IconSvgCropped
                width={58}
                height={58}
                className={`${!loadingStatus && styles.loading}`}
            />
            <h3>{loadingStatus || 'Загрузка'}</h3>
            <Link
                className={styles.link}
                style={{ visibility: loadingStatus ? 'visible' : 'hidden' }}
                href="/me"
            >
                <IconArrowBack />
                Назад
            </Link>
        </div>
    );
};

const Login = () => {
    const loginMinecraft = async (code: string): Promise<void> => {
        return new Promise((resolve, reject) => {
            ApiManager.loginMinecraft(code)
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
                <h1>Войти через</h1>

                <div className={styles.login_through}>
                    <a
                        className={styles.login_button}
                        href={'/me/login'}
                        style={{ '--color': '#5662f6' } as CSSProperties}
                    >
                        <img alt="" src="/static/icons/discord.svg" />
                        Discord
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

                <span className={styles.p} id="about_logging">
                    Для регистрации вам нужно быть участником Discord сервера{' '}
                    <a href="https://baad.pw/ds" className={styles.a}>
                        Pwgood
                    </a>{' '}
                    и иметь одну из этих&nbsp;
                    <RolesDialog>
                        <span
                            style={{
                                cursor: 'pointer',
                                textDecoration: 'underline'
                            }}
                        >
                            ролей
                        </span>
                    </RolesDialog>
                    .
                </span>
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
