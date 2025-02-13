'use client';

import React, { CSSProperties, JSX } from 'react';
import { useEffect, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import styles from '@/app/styles/me/me.module.css';
import useCookie from '@/app/modules/utils/useCookie';
import { Bandage } from '@/app/interfaces';
import { Me } from '@/app/modules/components/MeSidebar';
import Link from 'next/link';
import { SimpleGrid } from '@/app/modules/components/AdaptiveGrid';

import { IconArrowBack, IconBrandMinecraft, IconPlus } from '@tabler/icons-react';
import IconSvgCropped from '@/app/resources/icon-cropped.svg';
import { httpStatusCodes } from '../modules/utils/StatusCodes';
import { renderSkin } from '../modules/utils/SkinCardRender';
import ApiManager from '../modules/utils/apiManager';
import MinecraftConnect from '../modules/components/MinecraftConnect';
import RolesDialog from '../modules/components/RolesDialog';

const Main = () => {
    const router = useRouter();

    const searchParams = useSearchParams();
    const code = searchParams.get('code');

    const logged = useCookie('sessionId');
    const [isLogged, setIsLogged] = useState<boolean>(logged != undefined);
    const [loadingStatus, setLoadingStatus] = useState<string>('');

    const [elements, setElements] = useState<JSX.Element[]>(null);
    const [data, setData] = useState<Bandage[]>(null);

    useEffect(() => {
        data && renderSkin(data, styles).then(results => setElements(results));
    }, [data]);

    useEffect(() => {
        setIsLogged(logged != undefined);
    }, [logged]);

    useEffect(() => {
        if (code) {
            ApiManager.loginDiscord(code)
                .then(() => {
                    setIsLogged(true);
                    router.replace('/me');
                })
                .catch(response => {
                    setLoadingStatus(
                        `${response.status}: ${
                            response.data.message || httpStatusCodes[response.status]
                        }`
                    );
                });
        }
        return () => {};
    }, []);

    useEffect(() => {
        isLogged && ApiManager.getMeWorks().then(setData).catch(console.error);
    }, [isLogged]);

    return (
        <main>
            {!!code ? (
                <Loading loadingStatus={loadingStatus} />
            ) : !isLogged ? (
                <Login />
            ) : (
                <Me>
                    <div
                        style={
                            elements
                                ? { opacity: '1', transform: 'translateY(0)' }
                                : { opacity: '0', transform: 'translateY(50px)' }
                        }
                        className={styles.cont}
                        id="sidebar"
                    >
                        <Link
                            className={styles.create}
                            href="/workshop/create"
                            style={{ marginLeft: 'auto', marginRight: 'auto' }}
                        >
                            <IconPlus />
                            Создать
                        </Link>
                        <SimpleGrid>{elements}</SimpleGrid>
                    </div>
                </Me>
            )}
        </main>
    );
};

const Loading = ({ loadingStatus }: { loadingStatus: string }) => {
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
                style={{ visibility: !!loadingStatus ? 'visible' : 'hidden' }}
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

                <div
                    style={{
                        display: 'flex',
                        flexDirection: 'column',
                        marginBottom: '1rem',
                        gap: '.5rem'
                    }}
                >
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
                        <span style={{ cursor: 'pointer', textDecoration: 'underline' }}>
                            ролей
                        </span>
                    </RolesDialog>
                    .
                </span>
                <p style={{ color: 'gray', marginBottom: 0 }}>
                    Регистрируясь на сайте вы соглашаетесь с настоящими{' '}
                    <a className={styles.a} href="/tos" style={{ color: 'gray' }}>
                        условиями пользования
                    </a>
                </p>
            </div>
        </main>
    );
};

export default Main;
