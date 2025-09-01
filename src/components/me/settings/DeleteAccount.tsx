import { JSX, useEffect, useState } from 'react';
import style_base from '@/styles/minecraftConnect.module.css';
import style_connections from '@/styles/me/connections.module.css';
import style from '@/styles/me/AccountDeletion.module.css';
import { IconAlertCircle, IconTrashX, IconX } from '@tabler/icons-react';
import ReactCSSTransition from '@/components/CSSTransition';
import useSWR from 'swr';
import { deleteAccount, getMe } from '@/lib/api/user';
import Image from 'next/image';

interface EditConfirmationProps {
    children: JSX.Element;
    onInput(): Promise<void>;
    confirm_code: string;
}

const AccountDeletion = () => {
    const { data } = useSWR('me', () => getMe());

    if (!data) return undefined;
    return (
        <div className={`${style_connections.container} ${style.danger_zone}`}>
            <h3>
                <IconAlertCircle />
                Опасная зона
            </h3>
            <AccountDeletionDialog
                onInput={() =>
                    new Promise<void>((resolve, reject) => {
                        deleteAccount()
                            .then(() => {
                                window.location.reload();
                                resolve();
                            })
                            .catch(reject);
                    })
                }
                confirm_code={data.username}
            >
                <div className={style.open_button}>
                    <IconTrashX />
                    Удалить аккаунт
                </div>
            </AccountDeletionDialog>
        </div>
    );
};

const disableScroll = () => {
    const scrollY = window.scrollY;
    document.body.style.top = `-${scrollY}px`;
    document.body.style.position = 'fixed';
    document.body.style.width = '100%';
};

const enableScroll = () => {
    const scrollY = document.body.style.top;
    document.body.style.position = '';
    document.body.style.top = '';
    window.scrollTo(0, parseInt(scrollY || '0') * -1);
};

const AccountDeletionDialog = ({
    confirm_code,
    children,
    onInput
}: EditConfirmationProps) => {
    const [expanded, setExpanded] = useState<boolean>(false);
    const [available, setAvailable] = useState<boolean>(false);

    useEffect(() => {
        (expanded ? disableScroll : enableScroll)();
    }, [expanded]);

    return (
        <>
            <div onClick={() => setExpanded(true)}>{children}</div>
            <ReactCSSTransition
                state={expanded}
                timeout={150}
                classNames={{
                    enter: style_base.background_enter,
                    exitActive: style_base.background_exit_active
                }}
            >
                <div
                    className={`${style_base.background} ${style.delete_background}`}
                />
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
                    <div
                        className={style_base.container}
                        style={{ position: 'relative' }}
                    >
                        <Image
                            src="/static/peepoSad.png"
                            alt="peeposad"
                            width={96}
                            height={96}
                            draggable={false}
                            className={style.peepo}
                        />
                        <div className={style_base.header}>
                            <h3 className={style_base.header_title}>
                                <IconTrashX />
                                Удаление аккаунта
                            </h3>
                            <IconX
                                className={style_base.close}
                                onClick={() => setExpanded(false)}
                            />
                        </div>
                        <p className={style_base.instruct_connect}>
                            Это действие необратимо и удалит все ваши повязки, лайки
                            и сам аккаунт!
                        </p>
                        <p className={style.code_container}>
                            Для продолжения введите `<b>{confirm_code}</b>` ниже:
                        </p>

                        <input
                            style={{ borderRadius: '10px' }}
                            placeholder="Введите сюда"
                            id="id"
                            className={style_base.code_input}
                            onChange={e =>
                                setAvailable(e.target.value === confirm_code)
                            }
                        />

                        <button
                            className={
                                `${style.button} ` +
                                `${available && style.available}`
                            }
                            disabled={!available}
                            onClick={() => {
                                if (!available) return;
                                onInput()
                                    .then(() => setExpanded(false))
                                    .catch(response => {
                                        const err =
                                            document.getElementById('error')!;
                                        err.innerText = response.data.message;
                                        err.style.display = 'block';
                                    });
                            }}
                        >
                            Удалить аккаунт
                        </button>

                        <p className={style_base.error_label} id="error" />
                    </div>
                </div>
            </ReactCSSTransition>
        </>
    );
};

export default AccountDeletion;
