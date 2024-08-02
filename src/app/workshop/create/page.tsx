"use client";

import React, { useCallback, useEffect, useRef, useState } from 'react';
import Header from '@/app/modules/header.module';
import style from '@/app/styles/workshop/create/page.module.css';
import SkinView3D from '@/app/skinView.module';
import { anims } from '../poses';
import { useRouter } from "next/navigation";
import Select from 'react-select';
import { SlideButton } from '@/app/modules/nick_search.module';
import Client from '../[id]/bandage_engine.module';
import Link from 'next/link';
import Footer from '@/app/modules/footer.module';
import CategorySelector from '@/app/modules/category_selector.module';
import { authApi } from '@/app/api.module';
import * as Interfaces from "@/app/interfaces";
import debounce from 'lodash.debounce';
import InfoCard from '@/app/modules/info.module';
import useCookie from '@/app/modules/useCookie.module';
import { redirect } from 'next/navigation';
import { Cookies, useCookies } from 'next-client-cookies';
import { Fira_Code } from "next/font/google";
import { CustomLink } from '@/app/modules/search.module';
const fira = Fira_Code({ subsets: ["latin"] });


export default function Home() {
    const [SKIN, setSKIN] = useState<string>("");
    const [slim, setSlim] = useState<boolean>(false);
    const [pose, setPose] = useState<number>(1);
    const [height, setHeight] = useState<number>(-1);
    const logged = useCookie('sessionId');
    const cookies = useRef<Cookies>(useCookies());

    if (!cookies.current.get('sessionId')) {
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
        <body>
            <title>Создать · Повязки Pepeland</title>
            <meta name="description" content="Создание повязки." />
            <Header />
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
                            {height != -1 && <p style={{ margin: 0 }}>Расчётная высота: <span className={fira.className} style={{
                                padding: '5px',
                                backgroundColor: 'var(--dark-hover)',
                                borderRadius: '3px',
                                fontSize: '.8rem'
                            }}>{Math.floor(height / 2)}px</span></p>}
                            <Select
                                options={anims}
                                defaultValue={anims[pose]}
                                className={`react-select-container`}
                                classNamePrefix="react-select"
                                isSearchable={false}
                                onChange={(n, a) => setPose(n.value)}
                                formatOptionLabel={(nick_value) => nick_value.label}
                            />
                            <SlideButton onChange={(v) => { setSlim(v); client.current?.changeSlim(v) }} value={slim} label="Тонкие руки" />
                        </div>
                    </aside>
                    <Editor onBandageChange={(b64) => { client.current?.loadFromImage(b64) }}
                        onColorChange={(color) => { client.current?.setParams({ color: color }) }}
                        onColorableChange={(colorable) => { client.current?.setParams({ colorable: colorable }) }}
                        onBandageChangeSlim={(b64) => { client.current?.loadFromImage(b64, true) }}
                        onChangeSplitTypes={(split) => { client.current?.setParams({ split_types: split }) }}
                        onHeightChange={setHeight}
                    />
                </div>
                <Footer />
            </main>
        </body>
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

const Editor = ({ onBandageChange, onColorChange, onColorableChange, onBandageChangeSlim, onChangeSplitTypes, onHeightChange }: EditorProps) => {
    const router = useRouter();
    const [title, setTitle] = useState<string>("");
    const [description, setDescription] = useState<string>("");
    const [enabledCategories, setEnabledCategories] = useState<Interfaces.Category[]>([]);
    const [allCategories, setAllCategories] = useState<Interfaces.Category[]>([]);
    const [categories, setCategories] = useState<number[]>(undefined);
    const [base64, setBase64] = useState<string>(null);
    const [base64Slim, setBase64Slim] = useState<string>(null);
    const [mutex, setMutex] = useState<boolean>(false);
    const [colorable, setColorable] = useState<boolean>(false);
    const [splitTypes, setSplitTypes] = useState<boolean>(false);
    const [height, setHeight] = useState<number>(-1);

    useEffect(() => {
        authApi.get('categories?for_edit=true').then((response) => {
            if (response.status === 200) {
                setAllCategories(response.data as Interfaces.Category[]);
            }
        })
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
        const _colorable = categories.includes(Number(process.env.NEXT_PUBLIC_COLORABLE_ID));
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
        authApi.post('/workshop', {
            title: title,
            description: description,
            categories: categories,
            base64: base64.replace('data:image/png;base64,', ''),
            base64_slim: base64Slim?.replace('data:image/png;base64,', ''),
            split_type: splitTypes
        }).then((response) => {
            if (response.status !== 201) {
                const error_el = document.getElementById('create_error') as HTMLLabelElement;
                if (error_el) {
                    error_el.innerText = response.data.message_ru || response.data.message || `Unhandled error: ${response.status}`;
                }
            } else {
                router.replace(`/workshop/${response.data.external_id}`);
            }
        }).finally(() => { setMutex(false) })
    }

    return (
        <div className={style.editor_div}>
            <h3 style={{ margin: 0 }}>Перед началом создания повязки прочитайте <CustomLink href="/tutorials/bandage">туториал</CustomLink></h3>
            <Selector onChange={setBase64}
                onBandageChange={(ev) => {
                    onBandageChange(ev.img);
                    setHeight(ev.height)
                }}
                setTitle={(ev) => { if (!title) setTitle(ev) }} />
            <SlideButton onChange={setSplitTypes} label='Использовать разные повязки для разных типов скинов' />

            {splitTypes &&
                <>
                    <p style={{ margin: 0, fontWeight: 500 }}>Повязка для тонких рук</p>
                    <Selector onChange={setBase64Slim}
                        onBandageChange={(ev) => onBandageChangeSlim && onBandageChangeSlim(ev.img)}
                        heightVal={height} />
                </>
            }
            <p id="error" style={{ margin: 0, color: "rgb(247 22 22)" }}></p>
            <textarea maxLength={50} id="title" placeholder="Заголовок" className={style.textarea} onInput={(ev) => setTitle((ev.target as HTMLTextAreaElement).value)} value={title} />
            <textarea maxLength={300} placeholder="Описание" className={style.textarea} onInput={(ev) => setDescription((ev.target as HTMLTextAreaElement).value)} value={description} />

            {colorable &&
                <InfoCard title='Повязка отмечена как окрашиваемая!'>
                    <div>
                        <input type='color' id='color_select' onInput={debouncedHandleColorChange} />
                        <label htmlFor='color_select' style={{ marginLeft: '.5rem' }}>Предпросмотр цвета</label>
                    </div>
                </InfoCard>
            }

            <CategorySelector enabledCategories={enabledCategories}
                allCategories={allCategories}
                onChange={setCategories} />
            <label id="create_error" style={{ margin: 0, color: "rgb(247 22 22)" }}></label>
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
    heightVal?: number
}

const Selector = ({ setTitle, onBandageChange, onChange, heightVal }: SelectorInterface) => {
    const errorRef = useRef<HTMLParagraphElement>();
    const containerRef = useRef<HTMLLabelElement>();

    const getData = (file: File) => {
        if (!file) return;
        if (setTitle) setTitle(file.name.split('.').slice(0, -1).join('.'));

        const reader = new FileReader();

        reader.onload = () => {
            const img = new Image();
            img.onload = () => {
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
            }
            img.src = reader.result as string;
        }
        reader.readAsDataURL(file);
    }

    const onChangeInput = (evt: React.ChangeEvent<HTMLInputElement>) => {
        getData(evt.target?.files[0]);
        evt.target.files = null;
    }

    const ondragover = (evt: React.DragEvent<HTMLLabelElement>) => {
        if (evt.dataTransfer?.items[0].type === "image/png") {
            evt.preventDefault();
            containerRef.current.style.borderStyle = "solid";
        }
    };

    const ondragleave = (evt: React.DragEvent<HTMLLabelElement>) => {
        containerRef.current.style.borderStyle = "dashed";
    };

    const ondrop = (evt: React.DragEvent<HTMLLabelElement>) => {
        getData(evt.dataTransfer?.files[0])

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
                onDragOver={(evt) => ondragover(evt)}
                onDragLeave={(evt) => ondragleave(evt)}
                onDrop={(evt) => ondrop(evt)}>
                <div className={style.hidable}>
                    <input type="file"
                        name="imageInput"
                        accept="image/png"
                        onChange={(evt) => onChangeInput(evt)} />
                    <span id="select_file">Выберите файл<br />или<br />скиньте его сюда</span>
                </div>
            </label>
            <p ref={errorRef} style={{ margin: 0, marginBottom: '1rem', display: 'none' }} />
        </>
    );
}