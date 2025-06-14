'use client';

import React, { useCallback, useEffect, useRef, useState } from 'react';
import style from '@/styles/workshop/create/page.module.css';
import SkinView3D from '@/components/SkinView';
import { anims } from '@/app/workshop/poses';
import { useRouter } from 'next/navigation';
import Select from 'react-select';
import Client, { b64Prefix } from '@/lib/bandage_engine';
import CategorySelector from '@/components/CategorySelector';
import * as Interfaces from '@/types/global.d';
import debounce from 'lodash.debounce';
import InfoCard from '@/components/InfoCard';
import { redirect } from 'next/navigation';
import { Fira_Code } from 'next/font/google';
import { CustomLink } from '@/components/Search';
import asyncImage from '@/lib/asyncImage';
import SlideButton from '@/components/SlideButton';
import ApiManager from '@/lib/apiManager';
import { useNextCookie } from 'use-next-cookie';
const fira = Fira_Code({ subsets: ['latin'] });

const capitalize = (string: string) =>
    string.charAt(0).toUpperCase() + string.slice(1);

const lstrip = (string: string) => string.replace(/^\s+/, '');

export default function Home() {
    const [SKIN, setSKIN] = useState<string>('');
    const [slim, setSlim] = useState<boolean>(false);
    const [pose, setPose] = useState<number>(1);
    const [height, setHeight] = useState<number>(-1);
    const logged = useNextCookie('sessionId', 1000);

    if (!logged) {
        redirect('/me');
    }

    useEffect(() => {
        if (!logged) {
            redirect('/me');
        }
    }, [logged]);

    const client = useRef<Client>(null);

    const beforeUnload = (e: BeforeUnloadEvent) => {
        const confirmationMessage =
            'У вас есть несохраненные изменения. Вы уверены, что хотите покинуть страницу?';
        e.returnValue = confirmationMessage;
        return confirmationMessage;
    };

    useEffect(() => {
        client.current = new Client();
        client.current.onRendered = event => {
            setSKIN(event.skin);
            setSlim(event.slim);
        };

        client.current.onInit = () => {
            client.current.loadSkinUrl('/static/workshop_base.png');
        };

        client.current.init();
        window.addEventListener('beforeunload', beforeUnload);

        return () => {
            window.removeEventListener('beforeunload', beforeUnload);
        };
    }, []);

    return (
        <main className={style.main}>
            <div className={style.central_panel}>
                <aside className={style.skin_parent}>
                    <SkinView3D
                        SKIN={SKIN}
                        CAPE={null}
                        slim={slim}
                        className={style.skinview}
                        pose={pose}
                        background="/static/background_big.png"
                        id="canvas_container"
                    />

                    <div className={style.render_footer}>
                        {height != -1 && (
                            <p className={style.calculated_height_p}>
                                Расчётная высота:{' '}
                                <span
                                    className={
                                        `${fira.className} ` +
                                        `${style.calculated_height_val}`
                                    }
                                >
                                    {Math.floor(height / 2)}px
                                </span>
                            </p>
                        )}
                        <SlideButton
                            onChange={v => {
                                setSlim(v);
                                client.current?.changeSlim(v);
                            }}
                            value={slim}
                            label="Тонкие руки"
                        />
                        <Select
                            options={anims}
                            defaultValue={anims[pose]}
                            className={`react-select-container`}
                            classNamePrefix="react-select"
                            isSearchable={false}
                            onChange={n => setPose(n.value)}
                            instanceId="select-1"
                            formatOptionLabel={nick_value => nick_value.label}
                        />
                    </div>
                </aside>
                <Editor
                    onBandageChange={b64 => {
                        client.current?.loadFromImage(b64);
                    }}
                    onColorChange={color => {
                        client.current?.setParams({ color: color });
                    }}
                    onColorableChange={colorable => {
                        client.current?.setParams({ colorable: colorable });
                    }}
                    onBandageChangeSlim={b64 => {
                        client.current?.loadFromImage(b64, true);
                    }}
                    onChangeSplitTypes={split => {
                        client.current?.setParams({ split_types: split });
                    }}
                    onHeightChange={setHeight}
                />
            </div>
        </main>
    );
}

interface EditorProps {
    onBandageChange(img: HTMLImageElement): void;
    onBandageChangeSlim?(img: HTMLImageElement): void;
    onColorChange(color: string): void;
    onColorableChange(colorable: boolean): void;
    onChangeSplitTypes(evt: boolean): void;
    onHeightChange(evt: number): void;
}

const Editor = ({
    onBandageChange,
    onColorChange,
    onColorableChange,
    onBandageChangeSlim,
    onChangeSplitTypes,
    onHeightChange
}: EditorProps) => {
    const router = useRouter();
    const [title, setTitle] = useState<string>('');
    const [description, setDescription] = useState<string>('');
    const [allCategories, setAllCategories] = useState<Interfaces.Category[]>(
        []
    );
    const [categories, setCategories] = useState<number[]>([]);
    const [base64, setBase64] = useState<string>(null);
    const [base64Slim, setBase64Slim] = useState<string>(null);
    const [mutex, setMutex] = useState<boolean>(false);
    const [colorable, setColorable] = useState<boolean>(false);
    const [splitTypes, setSplitTypes] = useState<boolean>(false);
    const [height, setHeight] = useState<number>(-1);
    const [useOldMethod, setUseOldMethod] = useState<boolean>(false);
    const [error, setError] = useState<string>('');
    const [createError, setCreateError] = useState<string>('');

    useEffect(() => {
        ApiManager.getCategories(true)
            .then(data => {
                setAllCategories(data);
                if (window.location.hash === '#colorable') {
                    setColorable(true);
                }
            })
            .catch(console.error);
    }, []);

    const debouncedHandleColorChange = useCallback(
        // из-за частого вызова oninput на слабых клиентах сильно лагает,
        // поэтому сделан дебаунс на 5мс
        debounce(event => {
            onColorChange(event.target.value);
        }, 5),
        []
    );

    useEffect(() => {
        onColorableChange(colorable);
    }, [colorable]);

    useEffect(() => {
        const title_el = document.getElementById('title') as HTMLLabelElement;
        if (title_el) {
            title_el.style.borderColor = null;
        }
        return;
    }, [title]);

    useEffect(() => {
        onChangeSplitTypes(splitTypes);
    }, [splitTypes]);

    useEffect(() => {
        onHeightChange(height);
    }, [height]);

    const create = () => {
        if (!base64) {
            setError('Выберите изображение повязки');
            return;
        }

        if (!base64Slim && splitTypes) {
            setError('Выберите изображение повязки для тонких рук');
            return;
        }

        if (!title) {
            setError('Введите заголовок');
            return;
        }

        setError('');
        if (mutex) return;
        setMutex(true);

        ApiManager.createBandage({
            title: title,
            description: description,
            categories: categories,
            base64: base64.replace(b64Prefix, ''),
            base64_slim: base64Slim?.replace(b64Prefix, ''),
            split_type: splitTypes,
            colorable
        })
            .then(response =>
                router.replace(`/workshop/${response.data.external_id}`)
            )
            .catch(err => {
                if (typeof err.data.message === 'object') {
                    setCreateError(
                        err.data.message
                            .map((str: string) => capitalize(str))
                            .join('\n') || `Unhandled error: ${err.status}`
                    );
                } else {
                    setCreateError(err.data.message);
                }
            })
            .finally(() => {
                setMutex(false);
            });
    };

    return (
        <div className={style.editor_div}>
            <h2 style={{ marginTop: 0, marginBottom: '.5rem' }}>
                Создать повязку
            </h2>
            <h3 style={{ margin: 0 }}>
                Перед началом создания повязки прочитайте{' '}
                <CustomLink href="/tutorials/bandage">туториал</CustomLink>
            </h3>

            <SlideButton
                onChange={setUseOldMethod}
                label="Использовать старый способ загрузки повязок"
            />
            <SlideButton
                onChange={setSplitTypes}
                label="Использовать разные повязки для разных типов скинов"
            />
            <SlideButton
                label="Окрашиваемая"
                value={colorable}
                onChange={setColorable}
                strict
            />

            <Selector
                onChange={setBase64}
                onBandageChange={ev => {
                    onBandageChange(ev.img);
                    setHeight(ev.height);
                }}
                setTitle={ev => {
                    if (!title) setTitle(ev);
                }}
                useOld={useOldMethod}
            />

            {splitTypes && (
                <>
                    <p style={{ margin: 0, fontWeight: 500 }}>
                        Повязка для тонких рук
                    </p>
                    <Selector
                        onChange={setBase64Slim}
                        onBandageChange={ev =>
                            onBandageChangeSlim && onBandageChangeSlim(ev.img)
                        }
                        heightVal={height}
                        useOld={useOldMethod}
                    />
                </>
            )}
            <p style={{ margin: 0, color: '#dc2626' }}>{error}</p>
            <textarea
                maxLength={50}
                id="title"
                placeholder="Заголовок"
                className={style.textarea}
                onInput={ev =>
                    setTitle(lstrip((ev.target as HTMLTextAreaElement).value))
                }
                value={title}
            />
            <textarea
                maxLength={300}
                placeholder="Описание"
                className={style.textarea}
                onInput={ev =>
                    setDescription(
                        lstrip((ev.target as HTMLTextAreaElement).value)
                    )
                }
                value={description}
            />

            {colorable && (
                <InfoCard title="Повязка отмечена как окрашиваемая!">
                    <div>
                        <input
                            type="color"
                            id="color_select"
                            onInput={debouncedHandleColorChange}
                        />
                        <label
                            htmlFor="color_select"
                            style={{ marginLeft: '.5rem' }}
                        >
                            Предпросмотр цвета
                        </label>
                    </div>
                </InfoCard>
            )}

            <CategorySelector
                allCategories={allCategories}
                onChange={setCategories}
            />
            <label style={{ margin: 0, color: '#dc2626' }}>{createError}</label>
            <button onClick={create} className={style.skin_load}>
                Создать
            </button>
        </div>
    );
};

interface OnBandageChange {
    img: HTMLImageElement;
    height: number;
}
interface SelectorInterface {
    setTitle?(title: string): void;
    onBandageChange?({ img, height }: OnBandageChange): void;
    onChange(b64: string): void;
    heightVal?: number;
    useOld?: boolean;
}

const Selector = ({
    setTitle,
    onBandageChange,
    onChange,
    heightVal,
    useOld
}: SelectorInterface) => {
    const errorRef = useRef<HTMLParagraphElement>(null);
    const containerRef = useRef<HTMLLabelElement>(null);

    const getDataOld = (file: File) => {
        if (!file) return;
        if (setTitle) setTitle(file.name.split('.').slice(0, -1).join('.'));

        const reader = new FileReader();

        reader.onload = () => {
            asyncImage(reader.result as string).then(img => {
                if (img.width !== 16) {
                    setError(
                        'Развертка повязки должна иметь ширину 16 пикселей'
                    );
                    return;
                }
                if (img.height < 2 || img.height > 24) {
                    setError(
                        'Развертка повязки должна иметь высоту от 2 до 24 пикселей'
                    );
                    return;
                }

                if (heightVal != undefined && heightVal === -1) {
                    setError('Вначале загрузите основную повязку!');
                    return;
                }

                if (heightVal != undefined && img.height !== heightVal) {
                    setError('Высоты повязок должны быть одинаковыми!');
                    return;
                }

                if (img.height % 2 !== 0) {
                    setError('Развертка повязки должна иметь чётную высоту');
                    return;
                }
                clearError();
                if (onBandageChange)
                    onBandageChange({ img: img, height: img.height });
                onChange(reader.result as string);

                if (containerRef.current) {
                    containerRef.current.style.borderColor = '#576074';
                    containerRef.current.style.borderStyle = 'solid';
                }
            });
        };
        reader.readAsDataURL(file);
    };

    const getData = (file: File) => {
        if (!file) return;
        if (setTitle) setTitle(file.name.split('.').slice(0, -1).join('.'));

        const reader = new FileReader();

        reader.onload = () => {
            asyncImage(reader.result as string).then(img => {
                if (img.width !== 64 || img.height !== 64) {
                    setError(
                        'Изображение скина должно иметь ширину и высоту в 64 пикселя'
                    );
                    return;
                }

                const data = extractFromSkin(img, heightVal !== undefined);

                if (heightVal != undefined && heightVal === -1) {
                    setError('Вначале загрузите основную повязку!');
                    return;
                }

                if (heightVal != undefined && data.height !== heightVal) {
                    setError('Высоты повязок должны быть одинаковыми!');
                    return;
                }

                clearError();

                asyncImage(data.img).then(bandageImage => {
                    if (onBandageChange)
                        onBandageChange({
                            img: bandageImage,
                            height: data.height
                        });
                    onChange(data.img);
                });
                //if (onBandageChange) onBandageChange({ img: img, height: img.height });
                //onChange(reader.result as string);

                if (containerRef.current) {
                    containerRef.current.style.borderColor = '#576074';
                    containerRef.current.style.borderStyle = 'solid';
                }
            });
        };
        reader.readAsDataURL(file);
    };

    const extractFromSkin = (
        skin: HTMLImageElement,
        slim?: boolean
    ): { img: string; height: number } | null => {
        let top = -1; // Верхняя граница повязки
        let bottom = -1; // Нижняя граница повязки

        const skinCanvas = document.createElement('canvas');
        const skinContext = skinCanvas.getContext('2d');

        skinContext.drawImage(skin, 0, 0);

        const data = skinContext.getImageData(32, 52, 32, 12).data;

        for (let y = 0; y <= 12; y++) {
            for (let x = 0; x < 32; x++) {
                const index = (y * 32 + x) * 4;

                const a = data[index + 3];
                if (a > 0) {
                    top = y + 52;
                    break;
                }
            }
            if (top !== -1) break;
        }

        for (let y = 12; y >= 0; y--) {
            for (let x = 0; x < 32; x++) {
                const index = (y * 32 + x) * 4;

                const a = data[index + 3];
                if (a > 0) {
                    bottom = y + 52;
                    break;
                }
            }
            if (bottom !== -1) break;
        }

        if (bottom === -1 || top === -1) return null;

        const height = bottom - top + 1;
        const bandageCanvas = document.createElement('canvas');
        bandageCanvas.width = 16;
        bandageCanvas.height = height * 2;

        const bandageContext = bandageCanvas.getContext('2d');
        const bandageWidth = slim ? 14 : 16;
        bandageContext.drawImage(
            skin,
            32,
            top,
            bandageWidth,
            height,
            slim ? 1 : 0,
            height,
            bandageWidth,
            height
        );
        bandageContext.drawImage(
            skin,
            48,
            top,
            bandageWidth,
            height,
            slim ? 1 : 0,
            0,
            bandageWidth,
            height
        );

        return { img: bandageCanvas.toDataURL(), height: height * 2 };
    };

    const onChangeInput = (evt: React.ChangeEvent<HTMLInputElement>) => {
        const process = useOld ? getDataOld : getData;
        process(evt.target?.files[0]);
        evt.target.files = null;
    };

    const ondragover = (evt: React.DragEvent<HTMLLabelElement>) => {
        if (evt.dataTransfer?.items[0].type === 'image/png') {
            evt.preventDefault();
            containerRef.current.style.borderStyle = 'solid';
        }
    };

    const ondragleave = () => {
        containerRef.current.style.borderStyle = 'dashed';
    };

    const ondrop = (evt: React.DragEvent<HTMLLabelElement>) => {
        const process = useOld ? getDataOld : getData;
        process(evt.dataTransfer?.files[0]);

        evt.preventDefault();
        containerRef.current.style.borderStyle = 'dashed';
    };

    const setError = (err: string) => {
        errorRef.current.innerText = err;
        errorRef.current.style.display = 'block';
    };

    const clearError = () => {
        errorRef.current.innerText = '';
        errorRef.current.style.display = 'none';
    };

    return (
        <>
            <label
                className={style.skin_drop}
                ref={containerRef}
                onDragOver={ondragover}
                onDragLeave={ondragleave}
                onDrop={ondrop}
            >
                <div className={style.hidable}>
                    <input
                        type="file"
                        name="imageInput"
                        accept="image/png"
                        onChange={onChangeInput}
                        onClick={evt => {
                            const target = evt.target as HTMLInputElement;
                            target.value = null;
                        }}
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
            <p
                ref={errorRef}
                style={{ margin: 0, marginBottom: '1rem', display: 'none' }}
            />
        </>
    );
};
