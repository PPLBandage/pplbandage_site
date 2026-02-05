import { IconCheck, IconShirt, IconX } from '@tabler/icons-react';
import { useEffect, useState } from 'react';
import NextImage from 'next/image';
import style from '@/styles/editor/page.module.css';
import style_base from '@/styles/minecraftConnect.module.css';
import AsyncImage from '@/lib/asyncImage';
import Searcher from '@/components/workshop/NickSearch';
import axios, { AxiosError } from 'axios';
import ReactCSSTransition from '@/components/CSSTransition';
import { b64Prefix } from '@/lib/workshop/bandageEngine';
import { getSkin } from '@/lib/api/minecraft';
import { disableScroll, enableScroll } from '@/lib/scroll-utils';

type SkinLoadProps = {
    onChange(data: { data: string; slim: boolean; cape?: string } | null): void;
    expanded: boolean;
};

type DataType = {
    data: string;
    slim: boolean;
    cape?: string;
};

const SkinLoad = ({ expanded, onChange }: SkinLoadProps) => {
    const [data, setData] = useState<DataType | null>(null);
    const [error, setError] = useState<string>('');
    const [dropActive, setDropActive] = useState<boolean>(false);

    const loaded = !!data;
    useEffect(() => {
        setData(null);
        setDropActive(false);

        (expanded ? disableScroll : enableScroll)();
    }, [expanded]);

    const isSlim = (img: HTMLImageElement): boolean => {
        const canvas = document.createElement('canvas');
        const context = canvas.getContext('2d')!;
        context?.clearRect(0, 0, 64, 64);
        context?.drawImage(img, 0, 0, img.width, img.height);
        const pixelData = context.getImageData(46, 52, 1, 1).data;
        return pixelData[3] !== 255;
    };

    const loadSkin = (nickname: string) => {
        if (!nickname) return;

        getSkin(nickname)
            .then(data => {
                setData({
                    data: b64Prefix + data.skin,
                    slim: data.slim,
                    cape: data.cape
                });
                setDropActive(false);
            })
            .catch((err: Error | AxiosError) => {
                setData(null);

                if (!axios.isAxiosError(err)) {
                    setError(`Не удалось получить скин, смотри консоль`);
                    console.error(err);
                    return;
                }

                switch (err.status) {
                    case 404:
                        setError('Игрок с таким никнеймом не найден');
                        break;
                    case 429:
                        setError(
                            'Сервера Mojang перегружены, пожалуйста, попробуйте через пару минут'
                        );
                        break;
                    default:
                        setError(
                            err.response?.data?.message ??
                                `Не удалось получить скин (${err.code})`
                        );
                        break;
                }
            });
    };

    const getData = (file: File) => {
        if (!file) return;
        const reader = new FileReader();

        reader.onload = () => {
            AsyncImage(reader.result as string).then(img => {
                if (img.width !== 64 || img.height !== 64) {
                    setError('Скин должен иметь размеры 64x64 пикселя');
                    return;
                }
                setError('');
                setData({
                    data: reader.result as string,
                    slim: isSlim(img)
                });
            });
        };
        reader.readAsDataURL(file);
    };

    const ondragover = (evt: React.DragEvent<HTMLLabelElement>) => {
        if (evt.dataTransfer?.items[0].type === 'image/png') {
            evt.preventDefault();
            setDropActive(true);
        }
    };

    const ondrop = (evt: React.DragEvent<HTMLLabelElement>) => {
        getData(evt.dataTransfer?.files[0]);
        setDropActive(true);
        evt.preventDefault();
    };

    const onChangeInput = (evt: React.ChangeEvent<HTMLInputElement>) => {
        if (evt.target?.files && evt.target.files[0]) {
            getData(evt.target.files[0]);
        }
        evt.target.files = null;
    };

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
                <div className={style.skin_load_base}>
                    <div className={style.skin_load_container}>
                        <div className={style_base.header}>
                            <h3 className={style.skin_load_header}>
                                <IconShirt />
                                Загрузить скин
                            </h3>
                            <IconX
                                className={style_base.close}
                                onClick={() => onChange(null)}
                            />
                        </div>
                        <Searcher onChange={loadSkin} />
                        <label
                            className={style.skin_drop}
                            onDragOver={ondragover}
                            onDragLeave={() => setDropActive(false)}
                            onDrop={ondrop}
                            style={{
                                borderStyle: dropActive ? 'solid' : 'dashed'
                            }}
                        >
                            <div className={style.hidable}>
                                <input
                                    type="file"
                                    name="imageInput"
                                    id="imageInput"
                                    accept="image/png"
                                    onChange={onChangeInput}
                                />
                                <span id="select_file">
                                    Выберите файл
                                    <br />
                                    или
                                    <br />
                                    скиньте его сюда
                                </span>
                            </div>
                        </label>

                        <span>{error}</span>
                        {data && (
                            <div className={style.skin_load_result_container}>
                                <NextImage
                                    src={data.data}
                                    width={64}
                                    height={64}
                                    alt=""
                                />
                            </div>
                        )}

                        <button
                            className={
                                `${style.skin_load} ` +
                                `${!loaded && style.disabled_load}`
                            }
                            onClick={() => loaded && onChange(data)}
                            style={{ width: '100%' }}
                        >
                            <IconCheck
                                width={24}
                                height={24}
                                style={{ marginRight: '.2rem' }}
                            />
                            Готово
                        </button>
                    </div>
                </div>
            </ReactCSSTransition>
        </>
    );
};

export default SkinLoad;
