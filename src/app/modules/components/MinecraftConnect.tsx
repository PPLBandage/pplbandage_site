import { useState } from "react";
import { CSSTransition } from "react-transition-group"
import style from '@/app/styles/minecraftConnect.module.css';
import { IconBrandMinecraft, IconCheck, IconX } from "@tabler/icons-react";
import ApiManager from "../utils/apiManager";

interface MinecraftConnectProps {
    children: JSX.Element,
    onInput(code: string): Promise<void>
}

const MinecraftConnect = ({ children, onInput }: MinecraftConnectProps) => {
    const [expanded, setExpanded] = useState<boolean>(false);

    const selectText = (nodeId: string) => {
        const node = document.getElementById(nodeId);
        if (window.getSelection) {
            const selection = window.getSelection();
            const range = document.createRange();
            range.selectNodeContents(node);
            selection.removeAllRanges();
            selection.addRange(range);
        }
    }

    return (
        <>
            <div onClick={() => setExpanded(true)}>
                {children}
            </div>
            <CSSTransition
                in={expanded}
                timeout={230}
                classNames={{
                    enter: style['menu-enter'],
                    enterActive: style['menu-enter-active'],
                    exit: style['menu-exit'],
                    exitActive: style['menu-exit-active'],
                }}
                unmountOnExit>
                <div className={style.base}>
                    <div className={style.container}>
                        <div className={style.header}>
                            <h3 style={{ margin: 0, display: 'flex', gap: '.5rem', alignItems: 'center' }}><IconBrandMinecraft />Войти через Minecraft</h3>
                            <IconX className={style.close} onClick={() => setExpanded(false)} />
                        </div>
                        <p style={{ margin: 0, fontSize: '.9rem', opacity: .6 }}>Этот способ будет работать, если вы привязали аккаунт Minecraft в личном кабинете.</p>
                        <p style={{ margin: 0, fontSize: '.95rem' }}>Зайдите на Minecraft сервер
                            `<span style={{ color: "rgba(12, 247, 215)" }} id="oauth_name" onClick={() => selectText('oauth_name')}>
                                oauth.pplbandage.ru
                            </span>` и получите там 6-значный код.</p>

                        <div className={style.code_container}>
                            <input
                                placeholder='Введите 6-значный код'
                                type='number'
                                id='code'
                                className={style.code_input}
                                onChange={() => {
                                    const target = document.getElementById('code') as HTMLInputElement;
                                    if (target.value.length > 6) target.value = target.value.slice(0, 6)
                                }} />
                            <button
                                className={style.code_send}
                                onClick={() => {
                                    const target = document.getElementById('code') as HTMLInputElement;
                                    if (target.value.length != 6) return;

                                    onInput(target.value)
                                        .catch(response => {
                                            const data = response.data as { message: string };
                                            const err = document.getElementById('error') as HTMLParagraphElement;
                                            err.innerText = data.message;
                                            err.style.display = 'block';
                                        })
                                }}>
                                Отправить
                            </button>
                        </div>
                        <p style={{ margin: 0, color: '#ED4245', display: 'none' }} id="error" />
                        <div className={style.possibilities}>
                            <p style={{ margin: 0, fontSize: '1rem' }}>После ввода кода мы:</p>
                            <div>
                                <p><IconCheck width={15} height={15} />Получим доступ к вашему никнейму и UUID</p>
                                <p><IconX width={15} height={15} />Не сможем получить доступ к вашему аккаунту Mojang или Microsoft</p>
                            </div>
                        </div>
                    </div>
                </div>
            </CSSTransition>
        </>
    );
}

export default MinecraftConnect;