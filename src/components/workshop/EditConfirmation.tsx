import { JSX, useState } from 'react';
import style_base from '@/styles/minecraftConnect.module.css';
import style from '@/styles/EditConfirmation.module.css';
import { IconArchive, IconTrash, IconX } from '@tabler/icons-react';
import ReactCSSTransition from '../CSSTransition';

interface EditConfirmationProps {
    children: JSX.Element;
    onInput(): Promise<void>;
    confirm_code: string;
    action: 'delete' | 'archive';
}

const EditConfirmation = ({
    action,
    confirm_code,
    children,
    onInput
}: EditConfirmationProps) => {
    const [expanded, setExpanded] = useState<boolean>(false);
    const [available, setAvailable] = useState<boolean>(false);

    const titles = {
        delete: 'Подтвердите удаление',
        archive: 'Подтвердите архивацию'
    };

    const icons = {
        delete: <IconTrash />,
        archive: <IconArchive />
    };

    const action_confirm = {
        delete: 'Удалить',
        archive: 'Архивировать'
    };

    const background_style = {
        delete: style.delete_background,
        archive: style.archive_background
    };

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
                    className={`${style_base.background} ${background_style[action]}`}
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
                    <div className={style_base.container}>
                        <div className={style_base.header}>
                            <h3 className={style_base.header_title}>
                                {icons[action]}
                                {titles[action]}
                            </h3>
                            <IconX
                                className={style_base.close}
                                onClick={() => setExpanded(false)}
                            />
                        </div>
                        <p className={style_base.instruct_connect}>
                            Это действие имеет необратимый характер!
                        </p>
                        <p className={style.code_container}>
                            Для продолжения введите `<b>{confirm_code}</b>` ниже
                        </p>

                        <input
                            style={{ borderRadius: '10px' }}
                            placeholder="Введите идентификатор повязки"
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
                                        const err = document.getElementById('error');
                                        err.innerText = response;
                                        err.style.display = 'block';
                                    });
                            }}
                        >
                            {action_confirm[action]}
                        </button>

                        <p className={style_base.error_label} id="error" />
                    </div>
                </div>
            </ReactCSSTransition>
        </>
    );
};

export default EditConfirmation;
