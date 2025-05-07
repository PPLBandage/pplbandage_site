'use client';

import React, { CSSProperties, JSX, useEffect, useState } from 'react';
import ApiManager from '@/lib/apiManager';
import { Me } from '@/components/MeSidebar';
import {
    redirect,
    usePathname,
    useRouter,
    useSearchParams
} from 'next/navigation';
import { httpStatusCodes } from '@/lib/StatusCodes';
import RolesDialog from '@/components/RolesDialog';
import MinecraftConnect from '@/components/MinecraftConnect';
import styles from '@/styles/me/me.module.css';
import Link from 'next/link';
import {
    IconArrowBack,
    IconBrandDiscord,
    IconBrandMinecraft,
    IconLogin
} from '@tabler/icons-react';
import IconSvgCropped from '@/resources/icon-cropped.svg';
import { useNextCookie } from 'use-next-cookie';
import useSWR from 'swr';

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
    const { data } = useSWR('me', () => ApiManager.getMe());

    if (!data) return null;
    return (
        <Me data={data} self>
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

                <div className={styles.login_through}>
                    <a
                        className={styles.login_button}
                        href={'/me/login'}
                        style={{ '--color': '#5662f6' } as CSSProperties}
                    >
                        <IconBrandDiscord />
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
                        PWGood
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
