import { IconCheck, IconShirt, IconX } from '@tabler/icons-react';
import { useEffect, useState } from 'react';
import NextImage from 'next/image';
import style from '@/app/styles/editor/page.module.css';
import style_base from '@/app/styles/minecraftConnect.module.css';
import AsyncImage from '@/app/modules/utils/asyncImage';
import Searcher from '@/app/modules/components/NickSearch';
import ApiManager from '@/app/modules/utils/apiManager';
import axios, { AxiosError } from 'axios';
import ReactCSSTransition from '@/app/modules/components/CSSTransition';

const b64Prefix = 'data:image/png;base64,';

interface SkinLoadProps {
    onChange(data: { data: string; slim: boolean; cape?: string } | null): void;
    expanded: boolean;
}

const SkinLoad = ({ expanded, onChange }: SkinLoadProps) => {
    const [data, setData] = useState<{
        data: string;
        slim: boolean;
        cape?: string;
    }>(null);
    const [loaded, setLoaded] = useState<boolean>(false);

    useEffect(() => {
        setLoaded(false);
        setData(null);
    }, [expanded]);

    const isSlim = (img: HTMLImageElement): boolean => {
        const canvas = document.createElement('canvas');
        const context = canvas.getContext('2d');
        context?.clearRect(0, 0, 64, 64);
        context?.drawImage(img, 0, 0, img.width, img.height);
        const pixelData = context.getImageData(46, 52, 1, 1).data;
        return pixelData[3] !== 255;
    };

    const loadSkin = (nickname: string) => {
        if (!nickname) return;

        ApiManager.getSkin(nickname)
            .then(data => {
                setData({
                    data: b64Prefix + data.skin,
                    slim: data.slim,
                    cape: data.cape
                });
                setLoaded(true);
            })
            .catch((err: Error | AxiosError) => {
                setData(null);
                setLoaded(false);

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
                        setError(`Не удалось получить скин (${err.status})`);
                        break;
                }
            });
    };

    const setError = (err: string) => {
        const error = document.getElementById('error');
        if (error) error.innerText = err;
    };

    const clearError = () => {
        const error = document.getElementById('error');
        if (error) error.innerText = '';
    };

    const getData = (file: File) => {
        if (!file) return;
        const reader = new FileReader();

        reader.onload = () => {
            AsyncImage(reader.result as string).then(img => {
                if (img.width != 64 || img.height != 64) {
                    setError('Скин должен иметь размеры 64x64 пикселя');
                    return;
                }
                clearError();
                setData({
                    data: reader.result as string,
                    slim: isSlim(img)
                });
                setLoaded(true);
            });
        };
        reader.readAsDataURL(file);
    };

    const ondragover = (evt: React.DragEvent<HTMLLabelElement>) => {
        if (evt.dataTransfer?.items[0].type === 'image/png') {
            evt.preventDefault();
            const drag_container = document.getElementById(
                'drop_container'
            ) as HTMLDivElement;
            drag_container.style.borderStyle = 'solid';
        }
    };

    const ondragleave = () => {
        const drag_container = document.getElementById(
            'drop_container'
        ) as HTMLDivElement;
        drag_container.style.borderStyle = 'dashed';
    };

    const ondrop = (evt: React.DragEvent<HTMLLabelElement>) => {
        getData(evt.dataTransfer?.files[0]);

        evt.preventDefault();
        const drag_container = document.getElementById(
            'drop_container'
        ) as HTMLDivElement;
        drag_container.style.borderStyle = 'dashed';
    };

    const onChangeInput = (evt: React.ChangeEvent<HTMLInputElement>) => {
        getData(evt.target?.files[0]);
        evt.target.files = null;
    };

    return (
        <>
            <ReactCSSTransition
                state={expanded}
                timeout={150}
                classNames={{
                    enter: style_base['background-enter'],
                    exitActive: style_base['background-exit-active']
                }}
            >
                <div className={style_base.background} />
            </ReactCSSTransition>

            <ReactCSSTransition
                state={expanded}
                timeout={150}
                classNames={{
                    enter: style_base['menu-enter'],
                    exitActive: style_base['menu-exit-active']
                }}
            >
                <div className={style.skin_load_base}>
                    <div className={style.skin_load_container}>
                        <div className={style_base.header}>
                            <h3
                                style={{
                                    margin: 0,
                                    display: 'flex',
                                    gap: '.5rem',
                                    alignItems: 'center'
                                }}
                            >
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
                            id="drop_container"
                            onDragOver={ondragover}
                            onDragLeave={ondragleave}
                            onDrop={ondrop}
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

                        <span id="error" />
                        {data && (
                            <div
                                style={{
                                    display: 'flex',
                                    justifyContent: 'center'
                                }}
                            >
                                <NextImage
                                    src={data.data}
                                    width={64}
                                    height={64}
                                    alt=""
                                />
                            </div>
                        )}

                        <div
                            style={{
                                display: 'flex',
                                width: '100%',
                                gap: '.5rem'
                            }}
                        >
                            <button
                                className={`${style.skin_load} ${
                                    !loaded && style.disabled_load
                                }`}
                                onClick={() => {
                                    if (loaded) onChange(data);
                                }}
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
                </div>
            </ReactCSSTransition>
        </>
    );
};

export default SkinLoad;
