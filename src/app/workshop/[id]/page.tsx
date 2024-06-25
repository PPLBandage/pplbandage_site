"use client";

import React, { useCallback } from 'react';
import { useEffect, useState, useRef } from 'react';

import style from "@/app/styles/editor/page.module.css";
import * as Interfaces from "@/app/interfaces";

import axios from "axios";

import Client, { b64Prefix } from "./bandage_engine.module";
import SkinView3D from "@/app/skinView.module";

import Header from "@/app/modules/header.module";
import Searcher, { SlideButton } from "@/app/modules/nick_search.module";
import { CategoryEl } from '@/app/modules/card.module';
import NextImage from 'next/image';
import Select from 'react-select';
import NotFoundElement from '@/app/nf.module';
import debounce from 'lodash.debounce';
import NavigatorEl from '@/app/modules/navigator.module';
import { authApi } from '@/app/api.module';
import CategorySelector from '@/app/modules/category_selector.module';
import Footer from '@/app/modules/footer.module';
import { anims } from '../poses';


const body_part: readonly {value: number, label: String}[] = [
    { value: 0, label: "Левая рука"},
    { value: 1, label: "Левая нога"},
    { value: 2, label: "Правая рука"},
    { value: 3, label: "Правая нога"}
];

const layers: readonly {value: string, label: String}[] = [
    { value: "0", label: "На разных слоях"},
    { value: "1", label: "Только на первом слое"},
    { value: "2", label: "Только на втором слое"}
];

const getRandomColor = () => {
    const letters = '0123456789ABCDEF';
    let color = '#';
    for (var i = 0; i < 6; i++) {
      color += letters[Math.floor(Math.random() * 16)];
    }
    return color;
}

export default function Home({ params }: { params: { id: string } }) {
    const [bandage, setBandage] = useState<Interfaces.Bandage>(null);
    const [loaded, setLoaded] = useState<boolean>(false);
    const [isError, setIsError] = useState<boolean>(false);

    const [pose, setPose] = useState<number>(1);
    const [skin, setSkin] = useState<string>("");
    const [cape, setCape] = useState<string>("");
    const [slim, setSlim] = useState<boolean>(false);
    const [edit, setEdit] = useState<boolean>(false);

    const [randomColor, setRandomColor] = useState<string>("");
    const [loadExpanded, setLoadExpanded] = useState<boolean>(false);
    const client = useRef<Client>();

    const [refreshInitiator, setRefreshInitiator] = useState<boolean>(false);


    const debouncedHandleColorChange = useCallback(
        // из за частого вызова oninput на слабых клиентах сильно лагает,
        // поэтому сделан дебаунс на 5мс
        debounce((event) => {
            client.current.setParams({color: event.target.value});
        }, 5),
        []
    );

    useEffect(() => {
        setRefreshInitiator(false);
        client.current = new Client();
        client.current.addEventListener('skin_changed', (event: {skin: string, cape: string}) => {
            setSkin(event.skin);
            setCape(event.cape);
            setSlim(client.current.slim);
        });

        client.current.addEventListener("init", () => {
            axios.get(`/api/workshop/${params.id}`, {withCredentials: true, validateStatus: () => true}).then((response) => {
                if (response.status === 404) {
                    setIsError(true);
                    return;
                }
                if (response.status === 200) {
                    const data = response.data.data as Interfaces.Bandage;
                    setBandage(data);

                    const bandage = new Image();
                    bandage.src = b64Prefix + data.base64;

                    if (data.me_profile) client.current.loadSkin(data.me_profile.uuid);

                    bandage.onload = () => {
                        const height = bandage.height / 2;
                        const pepe_canvas = document.createElement('canvas') as HTMLCanvasElement;
                        const context_pepe = pepe_canvas.getContext("2d");
                        pepe_canvas.width = 16;
                        pepe_canvas.height = height;

                        const lining_canvas = document.createElement('canvas') as HTMLCanvasElement;
                        const context_lining = lining_canvas.getContext("2d");
                        lining_canvas.width = 16;
                        lining_canvas.height = height;

                        context_pepe.drawImage(bandage, 0, 0, 16, height, 0, 0, 16, height);
                        context_lining.drawImage(bandage, 0, height, 16, height, 0, 0, 16, height);
                        client.current.pepe_canvas = pepe_canvas;
                        client.current.lining_canvas = lining_canvas;
                        client.current.position = 6 - Math.floor(height / 2);
                        client.current.updatePositionSlider();
                        client.current.colorable = Object.values(data.categories).some(val => val.icon.indexOf('color-palette.svg') !== -1);
                        const randomColor = getRandomColor();
                        setRandomColor(randomColor);
                        client.current.setParams({color: randomColor});
                        client.current.rerender();
                        setLoaded(true);
                    };
                }
            });
        });

    }, [refreshInitiator]);

    const categories = bandage?.categories.map((category) => {
        if (category.icon === "/null") return undefined;
        return <CategoryEl key={category.id} category={category}/>
    });

    return (
        <body>
            <Header />
            {loadExpanded && <SkinLoad onChange={(evt) => {
                if (evt) {
                    client.current?.changeSkin(evt.data, evt.slim, evt.cape ? "data:image/png;base64," + evt.cape : "");
                }
                setLoadExpanded(false);
            }}/>}
            {isError && <NotFoundElement />}
            <main className={style.main} style={loaded ? {opacity: "1", transform: "translateY(0)"} : {opacity: "0", transform: "translateY(50px)"}}>
                <NavigatorEl path={[{
                        name: "Мастерская",
                        url: "/workshop"
                    },
                    {
                        name: bandage?.external_id,
                        url: `/workshop/${bandage?.external_id}`
                    }
                ]} style={{marginBottom: "1rem"}}/>
                {
                    bandage?.check_state ?
                    bandage?.check_state === "under review" ?
                    <div className={style.check_notification}>
                        <h3>На проверке</h3>
                        <p>Ваша работа сейчас проходит модерацию, дождитесь ее завершения</p>
                    </div> 
                    : 
                    <div className={style.check_notification} style={{borderColor: "red", backgroundColor: "rgba(255, 0, 0, .13)"}}>
                        <h3>Отклонено</h3>
                        <p>Ваша работа была отклонена модерацией. Для получения информации обратитесь в поддержку</p>
                    </div> : null
                }
                <div className={style.main_container}>
                    <div className={style.skin_parent}>
                            <SkinView3D SKIN={skin}
                                        CAPE={cape} 
                                        slim={slim} 
                                        className={style.render_canvas}
                                        pose={pose} 
                                        id="canvas_container" />
                            <div className={style.render_footer}>
                                <button className={style.skin_load} onClick={() => setLoadExpanded(true)}><NextImage src="/static/icons/plus.svg" alt="" width={32} height={32} />Загрузить скин</button>
                                <Select
                                    options={anims}
                                    defaultValue={anims[pose]}
                                    className={`react-select-container`}
                                    classNamePrefix="react-select"
                                    isSearchable={false}
                                    onChange={(n, a) => setPose(n.value)}
                                    formatOptionLabel={(nick_value) => nick_value.label}
                                />
                                <SlideButton onChange={(val) => client.current?.changeSlim(val)} value={slim} label="Тонкие руки"/>
                                <button className={style.skin_load} onClick={() => client.current?.download()}>
                                    <NextImage 
                                            src="/static/icons/download.svg" 
                                            alt="" 
                                            width={32} 
                                            height={32}
                                            style={{width: "1.5rem"}} />Скачать скин</button>
                            </div>
                        <div className={style.categories}>
                            {categories}
                        </div>
                    </div>
                    <div style={{width: "100%"}}>
                        { !edit ? <Info el={bandage} onClick={() => setEdit(true)} /> : 
                        <EditElement bandage={bandage} onClose={() => {
                                setEdit(false);
                                setRefreshInitiator(true);
                            }
                        } /> }
                        <hr />
                        <div style={{display: "flex", flexDirection: "column", gap: ".8rem"}}>
                            {client.current?.colorable && 
                                <div style={{display: "flex", alignItems: "center"}}>
                                    <input type='color' id='color_select' defaultValue={randomColor} onInput={debouncedHandleColorChange}/>
                                    <p style={{margin: 0, marginLeft: '.5rem'}}>Выберите цвет</p>
                                </div>
                            }
                            <div className={style.settings_slider}>
                                <input type="range" min="0" max='8' defaultValue='4' step='1' id='position' className={style.position} onInput={(evt) => {
                                        client.current?.setParams({position: Number((evt.target as HTMLInputElement).value)});
                                    }
                                }/>
                                <div className={style.settings_slider_1}>
                                    <SlideButton onChange={(val) => client.current?.setParams({first_layer: val})} 
                                                defaultValue={true}
                                                label='Первый слой' />

                                    <SlideButton onChange={(val) => client.current?.setParams({second_layer: val})} 
                                                defaultValue={true} 
                                                label='Второй слой'/>

                                    <SlideButton onChange={(val) => client.current?.setParams({clear_pix: val})} 
                                                defaultValue={true} 
                                                label='Очищать пиксели на втором слое'/>

                                    <Select
                                        options={body_part}
                                        defaultValue={body_part[0]}
                                        className={`react-select-container`}
                                        classNamePrefix="react-select"
                                        isSearchable={false}
                                        onChange={(n, a) => client.current?.setParams({body_part: n.value})}
                                    />
                                    <Select
                                        options={layers}
                                        defaultValue={layers[0]}
                                        className={`react-select-container`}
                                        classNamePrefix="react-select"
                                        isSearchable={false}
                                        onChange={(n, a) => client.current?.setParams({layers: n.value})}
                                    />
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                <Footer />
            </main>
        </body>
    );
}

const Info = ({el, onClick}: {el: Interfaces.Bandage, onClick(): void}) => {

    return <div className={style.info_container}>
                <h2 className={`${style.title} ${el?.permissions_level >= 1 && style.title_editable}`} onClick={() => {if (el?.permissions_level >= 1) onClick()}}>
                    {el?.title}
                    <NextImage className={style.edit_icon} src="/static/icons/edit.svg" alt="" width={32} height={32} /></h2>
                { el?.description && <p className={style.description}>{el?.description}</p> }
                <p className={style.author}><NextImage src="/static/icons/user.svg" alt="" width={32} height={32}/>{el?.author.name || "Unknown"}</p>
            </div>
}

interface SkinLoadProps {
    onChange(data: {data: string; slim: boolean; cape?: string} | null): void
}

interface SkinResponse {
    status: string,
    data: {
        skin: {
            data: string,
            slim: boolean
        },
        cape: string
    }
}

const SkinLoad = ({onChange}: SkinLoadProps) => {
    const [data, setData] = useState<{data: string; slim: boolean; cape?: string}>(null);

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
        axios.get(`/api/skin/${nickname}?cape=true`, { validateStatus: () => true }).then((response) => {
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
            const img = new Image();
            img.onload = () => {
                if (img.width != 64 || img.height != 64) {
                    setError('Скин должен иметь размеры 64x64 пикселя');
                    return;
                }
                clearError();
                setData({
                    data: reader.result as string,
                    slim: isSlim(img)
                });
            }
            img.src = reader.result as string;
        }
        reader.readAsDataURL(file);
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

    return <div className={style.skin_load_base}>
                <div className={style.skin_load_container}>
                <Searcher onChange={(evt) => loadSkin(evt)}/>
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
                <span id="error"></span>
                {data && <div style={{display: 'flex', justifyContent: 'center'}}>
                            <NextImage src={data.data} width={64} height={64} alt='' />
                        </div>
                }
                <button className={style.skin_load} onClick={() => onChange(data)}>
                    <NextImage src="/static/icons/done.svg" alt="" width={32} height={32} />Готово</button>
                </div>
           </div>
}

const access_level: readonly {value: number, label: String}[] = [
    { value: 0, label: "Ограниченный доступ"},
    { value: 1, label: "Доступ только по ссылке"},
    { value: 2, label: "Открытый доступ"}
];

const EditElement = ({bandage, onClose}: {bandage: Interfaces.Bandage, onClose(): void}) => {
    const [title, setTitle] = useState<string>(bandage?.title);
    const [description, setDescription] = useState<string>(bandage?.description);
    const [allCategories, setAllCategories] = useState<Interfaces.Category[]>([]);
    const [categories, setCategories] = useState<number[]>(undefined);
    const [accessLevel, setAccessLevel] = useState<number>(undefined);

    useEffect(() => {
        authApi.get('categories?for_edit=true').then((response) => {
            if (response.status === 200) {
                setAllCategories(response.data as Interfaces.Category[]);
            }
        })
    }, []);

    const save = () => {
        authApi.put(`workshop/${bandage.external_id}/edit`, {
            title: title,
            description: description !== "" ? description : null,
            categories: categories,
            access_level: accessLevel
        }).then((response) => {
            if (response.status === 200) {
                onClose();
                return;
            }
            if (response.status === 400) {
                alert(response.data.message_ru);
            }
        })
    }
    return  <div style={{display: "flex", flexDirection: "column", gap: ".3rem"}}>
                {bandage.permissions_level >= 2 ? <>
                    <textarea maxLength={50} placeholder="Заголовок" className={style.textarea} onInput={(ev) => setTitle((ev.target as HTMLTextAreaElement).value)} value={title} />
                    <textarea maxLength={300} placeholder="Описание" className={style.textarea} onInput={(ev) => setDescription((ev.target as HTMLTextAreaElement).value)} value={description} />
                </> : 
                <>
                    <h2 className={style.title}>{bandage?.title}</h2>
                    { bandage?.description && <p className={style.description}>{bandage?.description}</p> }
                </> }
                <CategorySelector enabledCategories={bandage?.categories}
                                  allCategories={allCategories} 
                                  onChange={setCategories} />
                <Select
                    options={access_level}
                    defaultValue={access_level[bandage.access_level]}
                    className={`react-select-container`}
                    classNamePrefix="react-select"
                    isSearchable={false}
                    onChange={(n, a) => setAccessLevel(n.value)}
                />
                <button className={style.skin_load} onClick={() => save()}>Сохранить</button>
            </div>
}