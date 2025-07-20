import { JSX, MouseEventHandler, useState } from 'react';
import style from '@/styles/minecraftConnect.module.css';
import { IconBrandMinecraft, IconCheck, IconX } from '@tabler/icons-react';
import ReactCSSTransition from '@/components/CSSTransition';

interface MinecraftConnectProps {
    children: JSX.Element;
    onInput(code: string): Promise<void>;
    login?: boolean;
}

const MinecraftConnect = ({ login, children, onInput }: MinecraftConnectProps) => {
    const [expanded, setExpanded] = useState<boolean>(false);

    const selectText: MouseEventHandler<HTMLSpanElement> = evt => {
        const node = evt.target as HTMLSpanElement;
        navigator.clipboard.writeText(node.innerText);
        if (window.getSelection) {
            const selection = window.getSelection();
            const range = document.createRange();
            range.selectNodeContents(node);
            selection.removeAllRanges();
            selection.addRange(range);
        }
    };

    const title = login ? 'Войти через Minecraft' : 'Подключить аккаунт Minecraft';

    return (
        <>
            <div onClick={() => setExpanded(true)}>{children}</div>
            <ReactCSSTransition
                state={expanded}
                timeout={150}
                classNames={{
                    enter: style.background_enter,
                    exitActive: style.background_exit_active
                }}
            >
                <div className={style.background} />
            </ReactCSSTransition>

            <ReactCSSTransition
                state={expanded}
                timeout={150}
                classNames={{
                    enter: style.menu_enter,
                    exitActive: style.menu_exit_active
                }}
            >
                <div className={style.base}>
                    <div className={style.container}>
                        <div className={style.header}>
                            <h3 className={style.header_title}>
                                <IconBrandMinecraft />
                                {title}
                            </h3>
                            <IconX
                                className={style.close}
                                onClick={() => setExpanded(false)}
                            />
                        </div>
                        <p className={style.instruct_connect}>
                            Зайдите на Minecraft сервер `
                            <span className={style.oauth_name} onClick={selectText}>
                                oauth.pplbandage.ru
                            </span>
                            ` и получите там 6-значный код.
                        </p>

                        <div className={style.code_container}>
                            <input
                                placeholder="Введите 6-значный код"
                                type="number"
                                id="code"
                                className={style.code_input}
                                onChange={() => {
                                    const target = document.getElementById(
                                        'code'
                                    ) as HTMLInputElement;
                                    if (target.value.length > 6)
                                        target.value = target.value.slice(0, 6);
                                }}
                            />
                            <button
                                className={style.code_send}
                                onClick={() => {
                                    const target = document.getElementById(
                                        'code'
                                    ) as HTMLInputElement;
                                    if (target.value.length != 6) return;

                                    onInput(target.value)
                                        .then(() => setExpanded(false))
                                        .catch(response => {
                                            const data = response.data as {
                                                message: string;
                                            };
                                            const err =
                                                document.getElementById('error');
                                            err.innerText =
                                                data.message ?? 'Внутренняя ошибка';
                                            err.style.display = 'block';
                                        });
                                }}
                            >
                                Отправить
                            </button>
                        </div>
                        <p className={style.error_label} id="error" />
                        <div className={style.possibilities}>
                            <p>После ввода кода мы:</p>
                            <div>
                                <p>
                                    <IconCheck width={15} height={15} />
                                    Получим доступ к вашему никнейму и UUID
                                </p>
                                <p>
                                    <IconX width={15} height={15} />
                                    Не сможем получить доступ к вашему аккаунту
                                    Mojang или Microsoft
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            </ReactCSSTransition>
        </>
    );
};

export default MinecraftConnect;
