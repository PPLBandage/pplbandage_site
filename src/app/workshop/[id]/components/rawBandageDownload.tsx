import { IconChevronDown } from "@tabler/icons-react";
import { useState } from "react";
import style from "@/app/styles/editor/page.module.css";
import Client, { b64Prefix } from "../bandage_engine";
import ReactCSSTransition from "@/app/modules/components/CSSTransition";

const RawBandageDownload = ({ client, bandage }: { client: React.MutableRefObject<Client>, bandage: string }) => {
    const [expanded, setExpanded] = useState<boolean>(false);

    return (
        <div style={{ position: 'relative' }}>
            <button className={style.skin_load}
                onClick={() => setExpanded(prev => !prev)}
                style={{ width: '100%' }}
            >
                Скачать повязку
                <IconChevronDown
                    width={24}
                    height={24}
                    style={{
                        transform: `rotate(${expanded ? '180deg' : '0deg'})`,
                        transition: 'transform 250ms',
                        marginLeft: '.2rem'
                    }}
                />
            </button>
            <ReactCSSTransition
                state={expanded}
                timeout={150}
                classNames={{
                    enter: style['menu-enter-bandage'],
                    exitActive: style['menu-exit-bandage-active'],
                }}
            >
                <div className={style.bandage_raw_menu}>
                    <button
                        className={style.skin_load}
                        style={{ width: '100%' }}
                        onClick={() => client.current?.download(b64Prefix + bandage, 'bandage.png')}
                    >
                        Исходный файл
                    </button>
                    <button
                        className={style.skin_load}
                        style={{ width: '100%' }}
                        onClick={() => client.current?.rerender(false, true)}
                    >
                        Обработанная
                    </button>
                </div>
            </ReactCSSTransition>
        </div>
    );
}

export default RawBandageDownload;