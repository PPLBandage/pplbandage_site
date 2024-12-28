"use client";

import React, { useCallback, useEffect, useRef, useState } from 'react';
import style from '@/app/styles/workshop/create/page.module.css';
import SkinView3D from '@/app/modules/components/SkinView';
import { anims } from '@/app/workshop/poses';
import { useRouter } from "next/navigation";
import Select from 'react-select';
import Client from '@/app/workshop/[id]/bandage_engine';
import CategorySelector from '@/app/modules/components/CategorySelector';
import * as Interfaces from "@/app/interfaces";
import debounce from 'lodash.debounce';
import InfoCard from '@/app/modules/components/InfoCard';
import useCookie from '@/app/modules/utils/useCookie';
import { redirect } from 'next/navigation';
import { Fira_Code } from "next/font/google";
import { CustomLink } from '@/app/modules/components/Search';
import asyncImage from '@/app/modules/utils/asyncImage';
import SlideButton from '@/app/modules/components/SlideButton';
import ApiManager from '@/app/modules/utils/apiManager';
const fira = Fira_Code({ subsets: ["latin"] });

const capitalize = (string: string) => string.charAt(0).toUpperCase() + string.slice(1);

const lstrip = (string: string) => string.replace(/^\s+/, '');

export default function Home() {
    const [SKIN, setSKIN] = useState<string>("");
    const [slim, setSlim] = useState<boolean>(false);
    const [pose, setPose] = useState<number>(1);
    const [height, setHeight] = useState<number>(-1);
    const logged = useCookie('sessionId');

    if (!logged) {
        redirect('/me');
    }

    useEffect(() => {
        if (!logged) {
            redirect('/me');
        }
    }, [logged])

    const client = useRef<Client>(null);

    const beforeUnload = (e: BeforeUnloadEvent) => {
        const confirmationMessage = 'У вас есть несохраненные изменения. Вы уверены, что хотите покинуть страницу?';
        e.returnValue = confirmationMessage;
        return confirmationMessage;
    }

    useEffect(() => {
        client.current = new Client();
        client.current.addEventListener('skin_changed', (event: { skin: string, cape: string }) => {
            setSKIN(event.skin);
            setSlim(client.current.slim);
        });

        client.current.loadSkinUrl("/static/workshop_base.png");
        window.addEventListener('beforeunload', beforeUnload);

        return () => {
            window.removeEventListener('beforeunload', beforeUnload);
        }

    }, []);


    return (
        <main className={style.main}>
            <div className={style.central_panel}>
                <aside className={style.skin_parent}>
                    <SkinView3D SKIN={SKIN}
                        CAPE={null}
                        slim={slim}
                        className={style.skinview}
                        pose={pose}
                        background='/static/background_big.png'
                        id="canvas_container" />

                    <div className={style.render_footer}>
                        {height != -1 && <p style={{ margin: 0, display: 'flex', alignItems: 'baseline', gap: '.3rem' }}>Расчётная высота: <span className={fira.className} style={{
                            padding: '5px',
                            backgroundColor: 'var(--dark-hover)',
                            borderRadius: '3px',
                            fontSize: '.8rem'
                        }}>{Math.floor(height / 2)}px</span></p>
                        }
                        <SlideButton
                            onChange={v => { setSlim(v); client.current?.changeSlim(v) }}
                            value={slim}
                            label="Тонкие руки" />
                        <Select
                            options={anims}
                            defaultValue={anims[pose]}
                            className={`react-select-container`}
                            classNamePrefix="react-select"
                            isSearchable={false}
                            onChange={(n, _) => setPose(n.value)}
                            formatOptionLabel={(nick_value) => nick_value.label}
                        />
                    </div>
                </aside>
                <Editor
                    onBandageChange={(b64) => { client.current?.loadFromImage(b64) }}
                    onColorChange={(color) => { client.current?.setParams({ color: color }) }}
                    onColorableChange={(colorable) => { client.current?.setParams({ colorable: colorable }) }}
                    onBandageChangeSlim={(b64) => { client.current?.loadFromImage(b64, true) }}
                    onChangeSplitTypes={(split) => { client.current?.setParams({ split_types: split }) }}
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
    const [title, setTitle] = useState<string>("");
    const [description, setDescription] = useState<string>("");
    const [enabledCategories, setEnabledCategories] = useState<Interfaces.Category[]>([]);
    const [allCategories, setAllCategories] = useState<Interfaces.Category[]>([]);
    const [categories, setCategories] = useState<number[]>([]);
    const [base64, setBase64] = useState<string>(null);
    const [base64Slim, setBase64Slim] = useState<string>(null);
    const [mutex, setMutex] = useState<boolean>(false);
    const [colorable, setColorable] = useState<boolean>(false);
    const [splitTypes, setSplitTypes] = useState<boolean>(false);
    const [height, setHeight] = useState<number>(-1);
    const [useOldMethod, setUseOldMethod] = useState<boolean>(false);

    useEffect(() => {
        ApiManager.getCategories(true)
            .then(data => {
                setAllCategories(data);
                if (window.location.hash === '#colorable') {
                    const colorable_category = data.find(category => category.colorable);
                    if (colorable_category) {
                        setEnabledCategories([colorable_category]);
                    }
                }
            })
            .catch(console.error);
    }, []);

    const debouncedHandleColorChange = useCallback(
        // из за частого вызова oninput на слабых клиентах сильно лагает,
        // поэтому сделан дебаунс на 5мс
        debounce((event) => {
            onColorChange(event.target.value);
        }, 5),
        []
    );


    useEffect(() => {
        if (!categories || categories.length === 0) {
            setColorable(false);
            onColorableChange(false);
            return;
        }
        const _colorable = categories.some(category => allCategories.find(cat => cat.id === category).colorable);
        setColorable(_colorable);
        onColorableChange(_colorable);
    }, [categories]);

    useEffect(() => {
        const title_el = document.getElementById('title') as HTMLLabelElement;
        if (title_el) {
            title_el.style.borderColor = null;
        }
        return;
    }, [title]);

    useEffect(() => {
        onChangeSplitTypes(splitTypes);
    }, [splitTypes])

    useEffect(() => {
        onHeightChange(height);
    }, [height])

    const create = () => {
        const error = document.getElementById('error') as HTMLLabelElement;
        if (!base64) {
            if (error) {
                error.textContent = "Выберите изображение повязки";
            }
            return;
        }

        if (!base64Slim && splitTypes) {
            if (error) {
                error.textContent = "Выберите изображение повязки для тонких рук";
            }
            return;
        }

        if (!title) {
            if (error) {
                error.textContent = "Введите заголовок";
            }
            return;
        }

        if (error) {
            error.textContent = "";
        }

        if (mutex) return;
        setMutex(true);

        ApiManager.createBandage({
            title: title,
            description: description,
            categories: categories,
            base64: base64.replace('data:image/png;base64,', ''),
            base64_slim: base64Slim?.replace('data:image/png;base64,', ''),
            split_type: splitTypes
        })
            .then(response => router.replace(`/workshop/${response.data.external_id}`))
            .catch(err => {
                const error_el = document.getElementById('create_error') as HTMLLabelElement;
                if (error_el) {
                    if (typeof err.data.message === 'object') {
                        error_el.innerText = err.data.message.map((str: string) => capitalize(str)).join('\n') ||
                            `Unhandled error: ${err.status}`;
                    } else {
                        error_el.innerText = err.data.message;
                    }
                }
            })
            .finally(() => { setMutex(false) });
    }

    return (
        <div className={style.editor_div}>
            <h2 style={{ marginTop: 0, marginBottom: '.5rem' }}>Создать повязку</h2>
            <h3 style={{ margin: 0 }}>Перед началом создания повязки прочитайте <CustomLink href="/tutorials/bandage">туториал</CustomLink></h3>

            <SlideButton
                onChange={setUseOldMethod}
                label='Использовать старый способ загрузки повязок' />

            <SlideButton
                onChange={setSplitTypes}
                label='Использовать разные повязки для разных типов скинов' />

            <Selector
                onChange={setBase64}
                onBandageChange={(ev) => {
                    onBandageChange(ev.img);
                    setHeight(ev.height)
                }}
                setTitle={(ev) => { if (!title) setTitle(ev) }}
                useOld={useOldMethod} />

            {splitTypes &&
                <>
                    <p style={{ margin: 0, fontWeight: 500 }}>Повязка для тонких рук</p>
                    <Selector
                        onChange={setBase64Slim}
                        onBandageChange={(ev) => onBandageChangeSlim && onBandageChangeSlim(ev.img)}
                        heightVal={height}
                        useOld={useOldMethod} />
                </>
            }
            <p id="error" style={{ margin: 0, color: "#dc2626" }}></p>
            <textarea
                maxLength={50}
                id="title"
                placeholder="Заголовок"
                className={style.textarea}
                onInput={ev => setTitle(lstrip((ev.target as HTMLTextAreaElement).value))}
                value={title} />
            <textarea
                maxLength={300}
                placeholder="Описание"
                className={style.textarea}
                onInput={ev => setDescription(lstrip((ev.target as HTMLTextAreaElement).value))}
                value={description} />

            {colorable &&
                <InfoCard
                    title='Повязка отмечена как окрашиваемая!'>
                    <div>
                        <input type='color' id='color_select' onInput={debouncedHandleColorChange} />
                        <label htmlFor='color_select' style={{ marginLeft: '.5rem' }}>Предпросмотр цвета</label>
                    </div>
                </InfoCard>
            }

            <CategorySelector
                enabledCategories={enabledCategories}
                allCategories={allCategories}
                onChange={setCategories} />
            <label id="create_error" style={{ margin: 0, color: "#dc2626" }}></label>
            <button onClick={() => create()} className={style.skin_load}>Создать</button>
        </div>
    );
}

interface OnBandageChange {
    img: HTMLImageElement,
    height: number
}
interface SelectorInterface {
    setTitle?(title: string): void
    onBandageChange?({ img, height }: OnBandageChange): void,
    onChange(b64: string): void,
    heightVal?: number,
    useOld?: boolean
}

const Selector = ({ setTitle, onBandageChange, onChange, heightVal, useOld }: SelectorInterface) => {
    const errorRef = useRef<HTMLParagraphElement>();
    const containerRef = useRef<HTMLLabelElement>();

    const getDataOld = (file: File) => {
        if (!file) return;
        if (setTitle) setTitle(file.name.split('.').slice(0, -1).join('.'));

        const reader = new FileReader();

        reader.onload = () => {
            asyncImage(reader.result as string).then((img) => {
                if (img.width !== 16) {
                    setError('Развертка повязки должна иметь ширину 16 пикселей');
                    return;
                }
                if (img.height < 2 || img.height > 24) {
                    setError('Развертка повязки должна иметь высоту от 2 до 24 пикселей');
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
                if (onBandageChange) onBandageChange({ img: img, height: img.height });
                onChange(reader.result as string);

                if (containerRef.current) {
                    containerRef.current.style.borderColor = "#576074";
                    containerRef.current.style.borderStyle = "solid";
                }
            });
        }
        reader.readAsDataURL(file);
    }

    const getData = (file: File) => {
        if (!file) return;
        if (setTitle) setTitle(file.name.split('.').slice(0, -1).join('.'));

        const reader = new FileReader();

        reader.onload = () => {
            asyncImage(reader.result as string).then(img => {
                if (img.width !== 64 || img.height !== 64) {
                    setError('Изображение скина должно иметь ширину и высоту в 64 пикселя');
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
                    if (onBandageChange) onBandageChange({ img: bandageImage, height: data.height });
                    onChange(data.img);
                })
                //if (onBandageChange) onBandageChange({ img: img, height: img.height });
                //onChange(reader.result as string);

                if (containerRef.current) {
                    containerRef.current.style.borderColor = "#576074";
                    containerRef.current.style.borderStyle = "solid";
                }
            });
        }
        reader.readAsDataURL(file);
    }

    const extractFromSkin = (skin: HTMLImageElement, slim?: boolean): { img: string; height: number; } | null => {
        let top = -1;  // Верхняя граница повязки
        let bottom = -1;  // Нижняя граница повязки 

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
        bandageContext.drawImage(skin, 32, top, bandageWidth, height, slim ? 1 : 0, height, bandageWidth, height);  // first layer
        bandageContext.drawImage(skin, 48, top, bandageWidth, height, slim ? 1 : 0, 0, bandageWidth, height);  // second layer

        return { img: bandageCanvas.toDataURL(), height: height * 2 };
    }

    const onChangeInput = (evt: React.ChangeEvent<HTMLInputElement>) => {
        useOld ? getDataOld(evt.target?.files[0]) : getData(evt.target?.files[0])
        evt.target.files = null;
    }

    const ondragover = (evt: React.DragEvent<HTMLLabelElement>) => {
        if (evt.dataTransfer?.items[0].type === "image/png") {
            evt.preventDefault();
            containerRef.current.style.borderStyle = "solid";
        }
    };

    const ondragleave = () => {
        containerRef.current.style.borderStyle = "dashed";
    };

    const ondrop = (evt: React.DragEvent<HTMLLabelElement>) => {
        useOld ? getDataOld(evt.dataTransfer?.files[0]) : getData(evt.dataTransfer?.files[0])

        evt.preventDefault();
        containerRef.current.style.borderStyle = "dashed";
    };

    const setError = (err: string) => {
        errorRef.current.innerText = err;
        errorRef.current.style.display = 'block';
    }

    const clearError = () => {
        errorRef.current.innerText = "";
        errorRef.current.style.display = 'none';
    }

    return (
        <>
            <label className={style.skin_drop}
                ref={containerRef}
                onDragOver={ondragover}
                onDragLeave={ondragleave}
                onDrop={ondrop}>
                <div className={style.hidable}>
                    <input type="file"
                        name="imageInput"
                        accept="image/png"
                        onChange={onChangeInput} />
                    <span id="select_file">Выберите файл<br />или<br />скиньте его сюда</span>
                </div>
            </label>
            <p ref={errorRef} style={{ margin: 0, marginBottom: '1rem', display: 'none' }} />
        </>
    );
}
