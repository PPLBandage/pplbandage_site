import { CSSProperties, JSX, useEffect, useState } from 'react';
import style_base from '@/styles/minecraftConnect.module.css';
import {
    IconBrandDiscord,
    IconBrandTwitch,
    IconFlag,
    IconX
} from '@tabler/icons-react';
import styles from '@/styles/me/me.module.css';
import style_main from '@/styles/RolesDialog.module.css';
import ReactCSSTransition from './CSSTransition';
import { Role } from '@/types/global.d';
import IconBoosty from '@/resources/boosty.svg';
import IconPPL from '@/resources/icon.svg';
import style_workshop from '@/styles/workshop/page.module.css';
import IconSvg from '@/resources/icon.svg';
import { getRoles } from '@/lib/apiManager';

const RolesDialog = ({ children }: { children: JSX.Element }) => {
    const [expanded, setExpanded] = useState<boolean>(false);
    const [roles, setRoles] = useState<Role[]>([]);

    useEffect(() => {
        getRoles().then(setRoles).catch(console.error);
    }, []);

    const roles_el = roles.map(role => {
        return (
            <div key={role.id} className={styles.role_container}>
                <span
                    style={{ backgroundColor: '#' + role.color.toString(16) }}
                    className={styles.role_dot}
                ></span>
                <span className={styles.role_title}>{role.title}</span>
            </div>
        );
    });

    return (
        <>
            <span onClick={() => setExpanded(true)}>{children}</span>
            <ReactCSSTransition
                state={expanded}
                timeout={150}
                classNames={{
                    enter: style_base.background_enter,
                    exitActive: style_base.background_exit_active
                }}
            >
                <div className={style_base.background} />
            </ReactCSSTransition>

            <ReactCSSTransition
                state={expanded}
                timeout={150}
                classNames={{
                    enter: style_base.menu_enter,
                    exitActive: style_base.menu_exit_active
                }}
            >
                <div className={style_base.base}>
                    <div className={style_base.container}>
                        <div className={style_base.header}>
                            <h3 className={style_base.header_title}>
                                <IconFlag />
                                Роли для регистрации
                            </h3>
                            <IconX
                                className={style_base.close}
                                onClick={() => setExpanded(false)}
                            />
                        </div>
                        <p className={style_base.instruct_connect}>
                            Для регистрации Вы должны иметь одну из этих ролей
                            на Discord сервере PWGood.
                        </p>

                        {roles_el.length !== 0 ? (
                            <div className={style_main.roles_container}>
                                {roles_el}
                            </div>
                        ) : (
                            <IconSvg
                                width={64}
                                height={64}
                                className={style_workshop.loading}
                            />
                        )}

                        <h4 style={{ margin: 0, marginTop: '.5rem' }}>
                            Ссылки на соцсети Пугода:
                        </h4>
                        <div className={style_main.container}>
                            <a
                                className={style_main.link}
                                href="https://baad.pw/twitch"
                                style={
                                    { '--accent': '#772ce8' } as CSSProperties
                                }
                            >
                                <IconBrandTwitch />
                                Twitch
                            </a>
                            <a
                                className={style_main.link}
                                href="https://baad.pw/ds"
                                style={
                                    { '--accent': '#4752c4' } as CSSProperties
                                }
                            >
                                <IconBrandDiscord />
                                Discord
                            </a>
                            <a
                                className={style_main.link}
                                href="https://baad.pw/boosty"
                                style={
                                    {
                                        '--accent': '#f15f2c'
                                    } as CSSProperties
                                }
                            >
                                <IconBoosty />
                                Boosty
                            </a>
                            <a
                                className={style_main.link}
                                href="https://pepeland.net"
                                style={
                                    {
                                        '--accent': '#0f766e'
                                    } as CSSProperties
                                }
                            >
                                <IconPPL
                                    style={{ width: '24px', height: '24px' }}
                                />
                                Сайт Пепеленда
                            </a>
                        </div>
                    </div>
                </div>
            </ReactCSSTransition>
        </>
    );
};

export default RolesDialog;
