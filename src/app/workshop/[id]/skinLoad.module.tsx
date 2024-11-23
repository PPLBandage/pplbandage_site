import { IconCheck, IconX } from "@tabler/icons-react";
import { useState } from "react";
import NextImage from 'next/image';
import style from "@/app/styles/editor/page.module.css";
import AsyncImage from "@/app/modules/components/asyncImage.module";
import Searcher from "@/app/modules/components/nick_search.module";
import ApiManager from "@/app/modules/utils/apiManager";

const b64Prefix = "data:image/png;base64,";

interface SkinLoadProps {
    onChange(data: { data: string; slim: boolean; cape?: string } | null): void
}

interface SkinResponse {
    data: {
        skin: {
            data: string,
            slim: boolean
        },
        cape: string
    }
}

const SkinLoad = ({ onChange }: SkinLoadProps) => {
    const [data, setData] = useState<{ data: string; slim: boolean; cape?: string }>(null);
    const [loaded, setLoaded] = useState<boolean>(false);

    const isSlim = (img: HTMLImageElement): boolean => {
        const canvas = document.createElement('canvas');
        const context = canvas.getContext('2d');
        context?.clearRect(0, 0, 64, 64);
        context?.drawImage(img, 0, 0, img.width, img.height);
        const pixelData = context.getImageData(46, 52, 1, 1).data;
        return pixelData[3] !== 255;
    }

    const loadSkin = (nickname: string) => {
        if (!nickname) {
            return;
        }

        ApiManager.getSkin(nickname).then(response => {
            if (response.status !== 200) {
                switch (response.status) {
                    case 404:
                        setError("Игрок с таким никнеймом не найден!");
                        break;
                    case 429:
                        setError("Сервера Mojang перегружены, пожалуйста, попробуйте через пару минут");
                        break;
                    default:
                        setError(`Не удалось получить ник! (${response.status})`);
                        break;
                }
                return;
            }

            const data = response.data as SkinResponse;
            setData({
                data: b64Prefix + data.data.skin.data,
                slim: data.data.skin.slim,
                cape: data.data.cape
            });
            setLoaded(true);
        });
    }

    const setError = (err: string) => {
        const error = document.getElementById("error");
        if (error) {
            error.innerText = err;
        }
    }

    const clearError = () => {
        const error = document.getElementById("error");
        if (error) {
            error.innerText = "";
        }
    }

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
        }
        reader.readAsDataURL(file);
    }

    const ondragover = (evt: React.DragEvent<HTMLLabelElement>) => {
        if (evt.dataTransfer?.items[0].type === "image/png") {
            evt.preventDefault();
            const drag_container = document.getElementById("drop_container") as HTMLDivElement;
            drag_container.style.borderStyle = "solid";
        }
    }

    const ondragleave = () => {
        const drag_container = document.getElementById("drop_container") as HTMLDivElement;
        drag_container.style.borderStyle = "dashed";
    }

    const ondrop = (evt: React.DragEvent<HTMLLabelElement>) => {
        getData(evt.dataTransfer?.files[0]);

        evt.preventDefault();
        const drag_container = document.getElementById("drop_container") as HTMLDivElement;
        drag_container.style.borderStyle = "dashed";
    }

    const onChangeInput = (evt: React.ChangeEvent<HTMLInputElement>) => {
        getData(evt.target?.files[0]);
        evt.target.files = null;
    }

    return <div className={style.skin_load_base}>
        <div className={style.skin_load_container}>
            <Searcher onChange={loadSkin} />
            <label className={style.skin_drop}
                id="drop_container"
                onDragOver={ondragover}
                onDragLeave={ondragleave}
                onDrop={ondrop}>
                <div className={style.hidable}>
                    <input type="file"
                        name="imageInput"
                        id="imageInput"
                        accept="image/png"
                        onChange={onChangeInput} />
                    <span id="select_file">Выберите файл<br />или<br />скиньте его сюда</span>
                </div>
            </label>

            <span id="error"></span>

            {data &&
                <div style={{ display: 'flex', justifyContent: 'center' }}>
                    <NextImage src={data.data} width={64} height={64} alt='' />
                </div>
            }

            <div style={{ display: 'flex', width: '100%', gap: '.5rem' }}>
                <button className={style.skin_load} onClick={() => onChange(null)} style={{ aspectRatio: 1 }}>
                    <IconX width={24} height={24} style={{ margin: 0 }} />
                </button>
                <button className={`${style.skin_load} ${!loaded && style.disabled_load}`} onClick={() => { loaded && onChange(data) }} style={{ width: '100%' }}>
                    <IconCheck width={24} height={24} style={{ marginRight: '.2rem' }} />Готово
                </button>
            </div>
        </div>
    </div>
}

export default SkinLoad;