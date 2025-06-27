import style_base from '@/styles/minecraftConnect.module.css';
import { IconArrowBounce, IconX } from '@tabler/icons-react';
import ReactCSSTransition from '../CSSTransition';
import { CustomLink } from '../workshop/Search';

const ProviderMigrationDialog = ({
    expanded,
    setExpanded
}: {
    expanded: boolean;
    setExpanded: (s: boolean) => void;
}) => {
    return (
        <>
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
                                <IconArrowBounce />
                                Миграция регистрации
                            </h3>
                            <IconX
                                className={style_base.close}
                                onClick={() => setExpanded(false)}
                            />
                        </div>
                        <p className={style_base.instruct_connect}>
                            В связи с блокировкой сервиса авторизации Discord в РФ мы
                            приняли решение перенести регистрацию пользователей на
                            другую платформу.
                            <br />
                            <br />
                            Вы можете проголосовать за удобный для Вас сервис
                            авторизации по ссылке ниже:
                            <br />
                            <CustomLink
                                href="https://t.me/andcool_channel/334"
                                target="_blank"
                            >
                                https://t.me/andcool_channel/334
                            </CustomLink>
                        </p>
                    </div>
                </div>
            </ReactCSSTransition>
        </>
    );
};

export default ProviderMigrationDialog;
