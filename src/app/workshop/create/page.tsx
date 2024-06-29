"use client";

import React, { useEffect, useRef, useState } from 'react';
import Header from '@/app/modules/header.module';
import style from '@/app/styles/workshop/create/page.module.css';
import SkinView3D from '@/app/skinView.module';
import { anims } from '../poses';
import NextImage from 'next/image';
import Select from 'react-select';
import { SlideButton } from '@/app/modules/nick_search.module';
import Client from '../[id]/bandage_engine.module';
import Link from 'next/link';
import Footer from '@/app/modules/footer.module';
import CategorySelector from '@/app/modules/category_selector.module';
import { authApi } from '@/app/api.module';
import * as Interfaces from "@/app/interfaces";


export default function Home() {
    const [SKIN, setSKIN] = useState<string>("");
    const [slim, setSlim] = useState<boolean>(false);
    const [pose, setPose] = useState<number>(1);

    const client = useRef<Client>(null);

    useEffect(() => {
        client.current = new Client();
        client.current.addEventListener('skin_changed', (event: {skin: string, cape: string}) => {
            setSKIN(event.skin);
            setSlim(client.current.slim);
        });

        client.current.loadSkinUrl("/static/workshop_base.png");

    }, []);


    return (
    <body style={{backgroundColor: "#17181C", margin: 0}}>
        <Header/>
        <main className={style.main}>
            <div className={style.central_panel}>
                <aside className={style.skin_parent}>
                    <SkinView3D SKIN={SKIN}
                                CAPE={null} 
                                slim={slim} 
                                className={style.skinview}
                                pose={pose} 
                                id="canvas_container" />
                    
                    <div className={style.render_footer}>
                        <Select
                            options={anims}
                            defaultValue={anims[pose]}
                            className={`react-select-container`}
                            classNamePrefix="react-select"
                            isSearchable={false}
                            onChange={(n, a) => setPose(n.value)}
                            formatOptionLabel={(nick_value) => nick_value.label}
                        />
                        <SlideButton onChange={(v) => {setSlim(v); console.log(v)}} value={slim} label="Тонкие руки"/>
                    </div>
                </aside>
                <Editor onBandageChange={(b64) => {client.current.loadFromImage(b64)}}/>
            </div>
            <Footer />
        </main>
    </body>
    );
}

interface EditorProps {
    onBandageChange(img: HTMLImageElement): void;
}

const Editor = ({onBandageChange}: EditorProps) => {
    const [title, setTitle] = useState<string>("");
    const [description, setDescription] = useState<string>("");
    const [enabledCategories, setEnabledCategories] = useState<Interfaces.Category[]>([]);
    const [allCategories, setAllCategories] = useState<Interfaces.Category[]>([]);
    const [categories, setCategories] = useState<number[]>(undefined);
    const [base64, setBase64] = useState<string>(null);

    useEffect(() => {
        authApi.get('categories?for_edit=true').then((response) => {
            if (response.status === 200) {
                setAllCategories(response.data as Interfaces.Category[]);
            }
        })
    }, []);

    /*useEffect(() => {
        console.log(categories)
    }, [categories]);*/

    const getData = (file: File) => {
        if (!file) return;
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

                if (img.height % 2 !== 0) {
                    setError('Развертка повязки должна иметь чётную высоту');
                    return;
                }
                clearError();
                onBandageChange(img);
                setBase64(reader.result as string)
            }
            img.src = reader.result as string;
        }
        reader.readAsDataURL(file);
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

    const ondragover = (evt: React.DragEvent<HTMLLabelElement>) => {
        if (evt.dataTransfer?.items[0].type === "image/png") {
            evt.preventDefault();
            const drag_container = document.getElementById("drop_container") as HTMLDivElement;
            drag_container.style.borderStyle = "solid";
        }
    };

    const ondragleave = (evt: React.DragEvent<HTMLLabelElement>) => {
        const drag_container = document.getElementById("drop_container") as HTMLDivElement;
        drag_container.style.borderStyle = "dashed";
    };

    const ondrop = (evt: React.DragEvent<HTMLLabelElement>) => {
        getData(evt.dataTransfer?.files[0]);
        
        evt.preventDefault();
        const drag_container = document.getElementById("drop_container") as HTMLDivElement;
        drag_container.style.borderStyle = "dashed";
    };

    const onChangeInput = (evt: React.ChangeEvent<HTMLInputElement>) => {
        getData(evt.target?.files[0]);
        evt.target.files = null;
    }

    const create = () => {
        authApi.post('/workshop', {
            title: title,
            description: description,
            categories: categories,
            base64: base64.replace('data:image/png;base64,', '')
        });
    }

    return (
        <div className={style.editor_div}>
            <h3 style={{margin: 0}}>Перед началом создания повязки прочитайте <Link href="/tutorials/bandage">туториал</Link></h3>
            <label className={style.skin_drop} 
                id="drop_container"
                onDragOver={(evt) => ondragover(evt)}
                onDragLeave={(evt) => ondragleave(evt)}
                onDrop={(evt) => ondrop(evt)}>
                <div className={style.hidable}>
                    <input type="file" 
                        name="imageInput" 
                        id="imageInput" 
                        accept="image/png"
                        onChange={(evt) => onChangeInput(evt)} />
                    <span id="select_file">Выберите файл<br />или<br />скиньте его сюда</span>
                </div>
            </label>
            <p id="error" style={{margin: 0, color: "rgb(247 22 22)"}}></p>
            <textarea maxLength={50} placeholder="Заголовок" className={style.textarea} onInput={(ev) => setTitle((ev.target as HTMLTextAreaElement).value)} value={title} />
            <textarea maxLength={300} placeholder="Описание" className={style.textarea} onInput={(ev) => setDescription((ev.target as HTMLTextAreaElement).value)} value={description} />
            <CategorySelector enabledCategories={enabledCategories}
                              allCategories={allCategories}
                              onChange={setCategories}/>
            <button onClick={() => create()} className={style.skin_load}>Создать</button>
        </div>
    );
}