"use client";

import React from 'react';
import { useEffect, useState, useRef } from 'react';
import { authApi } from "@/app/modules/utils/api.module";
import { useRouter, useSearchParams } from "next/navigation";
import styles from "@/app/styles/me/me.module.css";
import { Tooltip } from '@/app/modules/components/tooltip';
import Header from "@/app/modules/components/header.module";
import useCookie from '@/app/modules/utils/useCookie.module';
import { Cookies, useCookies } from 'next-client-cookies';
import { Bandage, Role } from '@/app/interfaces';
import { Me } from '@/app/modules/components/me.module';
import Link from 'next/link';
import { SimpleGrid } from '@/app/modules/components/adaptiveGrid.module';
import style_workshop from "@/app/styles/workshop/page.module.css";

import { IconArrowBack, IconPlus } from '@tabler/icons-react';
import IconSvgCropped from '@/app/resources/icon-cropped.svg';
import IconSvg from '@/app/resources/icon.svg';
import { httpStatusCodes } from '../modules/utils/statusCodes.module';
import { renderSkin } from '../modules/utils/skinCardRender.module';
import ApiManager from '../modules/utils/apiManager';

const Main = () => {
    const router = useRouter();

    const searchParams = useSearchParams();
    const code = searchParams.get('code');

    const cookies = useRef<Cookies>(useCookies());
    const logged = useCookie('sessionId');
    const [isLogged, setIsLogged] = useState<boolean>(cookies.current.get('sessionId') != undefined);
    const [loadingStatus, setLoadingStatus] = useState<string>('');

    const [elements, setElements] = useState<JSX.Element[]>(null);
    const [data, setData] = useState<Bandage[]>(null);

    useEffect(() => {
        data && renderSkin(data, styles).then(results => setElements(results));
    }, [data]);

    useEffect(() => {
        setIsLogged(logged != undefined);
    }, [logged])

    useEffect(() => {
        if (code) {
            authApi.post(`auth/discord/${code}`).then(response => {
                if (response.status !== 200) {
                    setLoadingStatus(`${response.status}: ${response.data.message_ru ||
                        response.data.message ||
                        httpStatusCodes[response.status]}`
                    );
                    return;
                }
                setIsLogged(true);
                router.replace('/me');
            })
        }
        return () => { }
    }, []);

    useEffect(() => {
        isLogged && ApiManager.getMeWorks().then(setData);
    }, [isLogged]);

    return (
        <body>
            <Header />
            {!!code ?
                <Loading loadingStatus={loadingStatus} /> :
                !isLogged ?
                    <Login /> :
                    <Me>
                        <div style={elements ? { opacity: "1", transform: "translateY(0)" } : { opacity: "0", transform: "translateY(50px)" }} className={styles.cont} id="sidebar">
                            <Link
                                className={styles.create}
                                href='/workshop/create'
                                style={{ marginLeft: 'auto', marginRight: 'auto' }}
                            >
                                <IconPlus />Создать
                            </Link>
                            <SimpleGrid>{elements}</SimpleGrid>
                        </div>
                    </Me>

            }
        </body>
    );
}

const Loading = ({ loadingStatus }: { loadingStatus: string }) => {
    return (
        <div className={styles.loading_container}>
            <IconSvgCropped width={58} height={58} className={`${!loadingStatus && styles.loading}`} />
            <h3>{loadingStatus || 'Загрузка'}</h3>
            <Link className={styles.link} style={{ visibility: !!loadingStatus ? 'visible' : 'hidden' }} href='/me'>
                <IconArrowBack />Назад
            </Link>
        </div>
    )
}

const Login = () => {
    const [roles, setRoles] = useState<Role[]>([]);
    const dat = roles.map((role) => {
        return (
            <div key={role.id} className={styles.role_container}>
                <span style={{ backgroundColor: "#" + role.color.toString(16) }} className={styles.role_dot}>
                </span>
                <span className={styles.role_title}>{role.title}</span>
            </div>
        )
    })

    useEffect(() => {
        ApiManager.getRoles().then(setRoles);
    }, [])

    return (
        <main className={styles.login_main}>
            <div className={styles.login_container}>
                <h1>Войти через</h1>
                <a className={styles.login_button} href={'/me/login'}>
                    <img alt="" src="/static/icons/discord.svg" />
                    Discord
                </a>

                <span className={styles.p} id="about_logging">Для регистрации вам нужно быть членом Discord сервера <a href='https://baad.pw/ds' className={styles.a}>Pwgood</a> и иметь одну из этих <Tooltip
                    parent_id="about_logging"
                    body={
                        <div className={styles.roles_container}>
                            {dat.length > 0 ? dat : <IconSvg width={86} height={86} className={style_workshop.loading} style={{ width: 'auto' }} />}
                        </div>} timeout={0} className={styles.roles_text_container}>
                    <span className={styles.roles_text}> ролей</span>
                </Tooltip>
                </span>
                <p style={{ color: "gray", marginBottom: 0 }}>Регистрируясь на сайте вы соглашаетесь с настоящими <a className={styles.a} href="/tos" style={{ color: "gray" }}>условиями пользования</a></p>
            </div>
        </main>
    );
}

export default Main;
