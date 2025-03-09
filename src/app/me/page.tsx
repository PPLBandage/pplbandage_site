'use client';

import React, { CSSProperties, JSX } from 'react';
import { useEffect, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import styles from '@/app/styles/me/me.module.css';
import { Bandage } from '@/app/interfaces';
import { Me } from '@/app/modules/components/MeSidebar';
import Link from 'next/link';
import { SimpleGrid } from '@/app/modules/components/AdaptiveGrid';

import { IconArrowBack, IconBrandMinecraft } from '@tabler/icons-react';
import IconSvgCropped from '@/app/resources/icon-cropped.svg';
import { httpStatusCodes } from '../modules/utils/StatusCodes';
import { renderSkin } from '../modules/utils/SkinCardRender';
import ApiManager from '../modules/utils/apiManager';
import MinecraftConnect from '../modules/components/MinecraftConnect';
import RolesDialog from '../modules/components/RolesDialog';
import { useNextCookie } from 'use-next-cookie';
import { CreateCard } from '../modules/components/Card';

const Main = () => {
    const router = useRouter();

    const searchParams = useSearchParams();
    const code = searchParams.get('code');

    const logged = useNextCookie('sessionId', 1000);
    const [isLogged, setIsLogged] = useState<boolean>(logged != undefined);
    const [loadingStatus, setLoadingStatus] = useState<string>('');

    const [elements, setElements] = useState<JSX.Element[]>(null);
    const [data, setData] = useState<Bandage[]>(null);

    useEffect(() => {
        if (data) {
            renderSkin(data, styles).then(results => {
                results
                    .reverse()
                    .unshift(<CreateCard key={-1} className={styles} />);
                setElements(results);
            });
        }
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
                            response.data.message ||
                            httpStatusCodes[response.status]
                        }`
                    );
                });
        }
        return () => {};
    }, []);

    useEffect(() => {
        if (isLogged) {
            ApiManager.getMeWorks().then(setData).catch(console.error);
        }
    }, [isLogged]);

    return (
        <main>
            {code ? (
                <Loading loadingStatus={loadingStatus} />
            ) : !isLogged ? (
                <Login />
            ) : (
                <Me>
                    <div
                        style={{
                            opacity: elements ? '1' : '0',
                            transform: elements
                                ? 'translateY(0)'
                                : 'translateY(50px)'
                        }}
                        className={styles.cont}
                        id="sidebar"
                    >
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

export default Main;
