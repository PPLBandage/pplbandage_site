"use client";

import React from 'react';
import { useEffect, useState, useRef } from 'react';
import React_image from 'next/image';

import style from "../../styles/editor/page.module.css";
import * as Interfaces from "../../interfaces";

import { AccordionItem as Item } from "@szhsin/react-accordion";
import axios from "axios";
import { Cookies, useCookies } from 'next-client-cookies';

import Client, { b64Prefix } from "./bandage_engine.module";
import SkinView3D from "../../skinView.module";

import Header from "../../modules/header.module";
import Searcher, { SlideButton } from "@/app/modules/nick_search.module";
import { CategoryEl } from '@/app/modules/card.module';
import NextImage from 'next/image';


const AccordionItem: React.FC<Interfaces.AccordionItemProps> = ({ header, dark, ...rest }) => (
    <Item
        {...rest}
        header={
            <>
                {header}
                <React_image width={24} height={24} className={`${style.chevron} ${dark ? style.dark : ""}`} src="/static/icons/chevron-down.svg" alt="Chevron Down" />
            </>
        }
        className={`${style.item} ${dark ? style.dark : ""}`}
        buttonProps={{
            className: ({ isEnter }) =>
                `${style.itemBtn} ${isEnter && style.itemBtnExpanded} ${dark ? style.dark : ""}`
        }}
        contentProps={{ className: ({ isEnter }) => `${style.itemContent} ${!isEnter ? style.not_enter : ""}`}}
        panelProps={{ className: style.itemPanel }}
    />
);


export default function Home({ params }: { params: { id: string } }) {
    const [bandage, setBandage] = useState<Interfaces.Bandage>(null);
    const cookies = useRef<Cookies>(useCookies());
    const [loaded, setLoaded] = useState<boolean>(false);

    const [skin, setSkin] = useState<string>("");
    const [cape, setCape] = useState<string>("");
    const [slim, setSlim] = useState<boolean>(false);

    const client = useRef<Client>();

    /*const providerValue = useAccordionProvider({
        allowMultiple: false,
        transition: true,
        transitionTimeout: 250
    });
    const { toggle, toggleAll } = providerValue;*/

    useEffect(() => {
        client.current = new Client();
        client.current.addEventListener('skin_changed', (event: {skin: string, cape: string}) => {
            setSkin(event.skin);
            setCape(event.cape);
            setSlim(client.current.slim);
        });

        client.current.addEventListener("init", () => {
            axios.get(`/api/bandages/${params.id}`, {withCredentials: true, validateStatus: () => true}).then((response) => {
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
                        client.current.rerender();
                        setLoaded(true);
                    };
                }
            });
        });

    }, [])

    /*const update_pepe = (new_value: SingleValue<Interfaces.ColourOption>, actionMeta: ActionMeta<Interfaces.ColourOption>) => {
        if (client.current)
            client.current.pepe_type = new_value?.value as string
        const custom_pepe = document.getElementById('custom_pepe') as HTMLInputElement;
        const color_pepe = document.getElementById('color_pepe') as HTMLDivElement;
        if (client.current?.pepe_type.startsWith("pepe")) color_pepe.style.display = "flex";
        else color_pepe.style.display = "none";

        if (new_value?.value == "not_set"){
            client.current?.rerender();
        }else if (new_value?.value != "custom_pepe") {
            client.current?.bandage_load(new_value?.value as string);
            custom_pepe.style.display = "none";
        } else {
            custom_pepe.style.display = "block";
        }

    }

    useEffect(() => {
        client.current = new Client();
        client.current?.addEventListener('skin_changed', (event: {skin: string, cape: string}) => {
            setSkin(event.skin);
            setCape(event.cape);
            setSlim(get_skin_type() == "alex");
        })

        const input = document.getElementById('imageInput') as HTMLInputElement;
        input.onchange = (event) => client.current?.loadSkinFile(event as Interfaces.FileUploadEvent);

        const custom_pepe = document.getElementById('custom_pepe') as HTMLInputElement;
        custom_pepe.onchange = (event: Event) => client.current?.load_custom(event as Interfaces.FileUploadEvent);

        let dark_local = cookies.current.get("dark");
        if (!dark_local) {
            const system_theme = Boolean(window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches);
            cookies.current.set("dark", String(system_theme), { expires: (365 * 10) });
            change_theme(system_theme, set_dark, cookies.current, setPanorama);
        } else {
            change_theme(dark_local == "true", set_dark, cookies.current, setPanorama);
        }

        const dropContainer = document.getElementById('drop_container') as HTMLLabelElement;
        dropContainer.ondragover = (evt) => {
            if (evt.dataTransfer?.items[0].type === "image/png") {
                evt.preventDefault();
                const drag_container = document.getElementById("drop_container") as HTMLDivElement;
                drag_container.style.borderStyle = "solid";
            }
        };

        dropContainer.ondragleave = (evt) => {
            const drag_container = document.getElementById("drop_container") as HTMLDivElement;
            drag_container.style.borderStyle = "dashed";
        };

        dropContainer.ondrop = (evt: DragEvent) => {
            const dT = new DataTransfer();
            dT.items.add(evt.dataTransfer?.files[0] as File);
            (document.getElementById('imageInput') as HTMLInputElement).files = dT.files;
            (document.getElementById('imageInput') as HTMLInputElement).dispatchEvent(new Event('change'))
            evt.preventDefault();
            const drag_container = document.getElementById("drop_container") as HTMLDivElement;
            drag_container.style.borderStyle = "dashed";
        };
            
        return () => {
            client.current?.removeEventListener("skin_changed");
        }
    }, [])*/

    const categories = bandage?.categories.map((category) => {
        return <CategoryEl key={category.id} category={category}/>
    });

    return (
        <body>
            <Header />
            <main className={style.main} style={loaded ? {opacity: "1", transform: "translateY(0)"} : {opacity: "0", transform: "translateY(50px)"}}>
                <div className={style.main_container}>
                    <div className={style.skin_parent}>
                            <SkinView3D SKIN={skin}
                                        CAPE={cape} 
                                        slim={slim} 
                                        className={style.render_canvas} 
                                        id="canvas_container" />
                            <div className={style.render_footer}>
                                <button className={style.skin_load}><NextImage src="/static/icons/plus.svg" alt="" width={32} height={32} />Загрузить скин</button>
                                <SlideButton onChange={(val) => client.current?.changeSlim(val)} value={slim} label="Тонкие руки"/>
                            </div>
                        <div className={style.categories}>
                            {categories}
                        </div>
                    </div>
                    <Info el={bandage} />
                </div>
            </main>
        </body>
    );
}

const Info = ({el}: {el: Interfaces.Bandage}) => {

    return <div className={style.info_container}>
                <h2 className={style.title}>{el?.title}</h2>
                <p className={style.description}>{el?.description}</p>
                <p className={style.author}><NextImage src="/static/icons/user.svg" alt="" width={32} height={32}/>{el?.author.name}</p>
            </div>
}


/*
<p>{bandage?.title}</p>
                    <div style={{display: "flex", alignItems: "center"}}>
                        <SlideButton onChange={(val) => client.current?.changeSlim(val)} value={slim} />
                        <label style={{marginLeft: "5px"}}>Тонкие руки</label>
                    </div>
                    <Searcher onChange={(evt) => client.current?.loadSkin(evt)}/>
*/

/*
<body className={dark ? "dark" : ""} style={{ colorScheme: dark ? "dark" : "light" }}>
            <Header />
            <main className={`${style.main} ${dark ? style.dark : ""}`}>
                <canvas id="pepe_original_canvas" style={{ display: "none" }} height="4"></canvas>
                <canvas id="lining_original_canvas" style={{ display: "none" }} height="4"></canvas>
                <SkinView3D SKIN={skin} CAPE={cape} PANORAMA={panorama} slim={slim} className={style.render_canvas} id="canvas_container"></SkinView3D>
                <button id="theme_swapper" className={`${style.theme_swapper} ${dark ? style.dark : ""}`} onClick={() => change_theme(!dark, set_dark, cookies.current, setPanorama)}>
                    <React_image width={32} height={32} src={dark ? "./static/icons/moon.svg" : "./static/icons/sun.svg"} id="sun" alt="theme swapper"/>
                </button>

                <div className={`${style.settings_container} ${dark ? style.dark : ""}`} id="settings_container">
                    <ControlledAccordion providerValue={providerValue}>
                        <AccordionItem header="1. Загрузка скина" dark={dark} initialEntered itemKey="item-1">
                            <div className={style.styles_main}>
                                <p id="error_label" className={style.error_label}></p>
                                <p style={{ display: "none" }} className={`trigger ${dark ? "dark" : ""}`}></p>
                                <Select
                                    value={{ value: nick_value.value, label: nick_value.label } as unknown as PropsValue<Interfaces.ColourOption>}
                                    options={nicknames}
                                    className={`react-select-container`}
                                    classNamePrefix="react-select"
                                    isSearchable={true}
                                    onInputChange={fetch_nicknames}
                                    inputValue={input_value}
                                    onChange={(new_value: SingleValue<Interfaces.ColourOption>, actionMeta: ActionMeta<Interfaces.ColourOption>) => {
                                            if (new_value?.value){
                                                set_loading(true);
                                                const nickname = new_value?.value;
                                                client.current?.loadSkin(nickname.split(" – ").length > 1 ? nickname.split(" – ")[1] : nickname);
                                            }
                                            set_loading(false);
                                        }
                                    }
                                    isLoading={loading as boolean}
                                    id="nick_input"
                                    formatOptionLabel={(nick_value) => nick_value.label}
                                />
                                <div style={{width: "100%"}}>
                                    <label className={style.input_file} id="drop_container" style={{marginTop: "1rem"}}>
                                        <div id="hidable" className={style.hidable}>
                                            <input type="file" name="imageInput" id="imageInput" accept="image/png" />
                                            <span id="select_file">Выберите файл<br />или<br />скиньте его сюда</span>
                                        </div>
                                    </label>

                                    <div className={`${style.input_file} ${style.hidable_canvas}`} id="hidable_canvas" style={{ display: "none" }}>
                                        <canvas id="original_canvas" width="64" height="64" className={style.original_canvas}></canvas>
                                        <div className={style.type_selector}>
                                            <h4 style={{ marginBottom: 0, marginTop: "1rem" }}>Тип скина:</h4>
                                            <div style={{ display: "flex", alignItems: "center" }}>
                                                <input type="radio" id="steve" name="skin_type" value="steve" onChange={() => client.current?.rerender()} style={{ marginTop: 0 }} defaultChecked/>
                                                <label htmlFor={"steve"}>Стандартный</label>
                                            </div>

                                            <div style={{ display: "flex", alignItems: "center" }}>
                                                <input type="radio" id="alex" name="skin_type" value="alex" onChange={() => client.current?.rerender()} style={{ marginTop: 0 }} />
                                                <label htmlFor={"alex"}>Тонкий</label>
                                            </div>
                                        </div>

                                        <button id="clear_skin" className={`${style.clear_skin} ${dark ? style.dark : ""}`} onClick={() => {
                                                client.current?.clearSkin();
                                                set_nick_value({value: "no_data", label: "Введите никнейм / UUID"});
                                            }
                                        }>Сбросить скин</button>
                                    </div>
                                </div>
                            </div>
                        </AccordionItem>
                        <AccordionItem header="2. Стили" dark={dark}>
                            <div className={style.styles_main} style={{ paddingBottom: "1rem" }}>
                                <p style={{ display: "none" }} className={`trigger ${dark ? "dark" : ""}`}></p>
                                <Select<Interfaces.ColourOption>
                                    defaultValue={shapeColourOptions[0]}
                                    options={now_date.getMonth() == 9 && now_date.getDate() >= 24 ? groupedOptionsHalloween : groupedOptions}
                                    components={{ Group }}
                                    onChange={update_pepe}
                                    className={`react-select-container`}
                                    classNamePrefix="react-select"
                                    isSearchable={false}
                                />
                                
                                <div style={{display: "none", alignItems: "center", marginTop: "0.7rem"}} id="color_pepe">
                                    <p style={{margin: 0}}>Выберите цвет:</p>
                                    <input type="color" id="color_picker" style={{marginLeft: "0.5rem"}}/>
                                </div>
                                <div id="custom_pepe" className={style.custom_pepe}>
                                    <p className={`${style.instruction} ${style.dark}`}><a target="_blank" href="https://github.com/Andcool-Systems/pepe_docs/blob/main/README.md">Инструкция</a></p>
                                    <input type="file" name="custom_pepe" accept="image/png" />
                                    <p id="error_label_pepe" className={style.error_label} />
                                </div>
                            </div>
                        </AccordionItem>

                        <AccordionItem header="3. Основные настройки" dark={dark}>
                            <div className={style.styles_main} style={{ paddingBottom: "1rem" }}>
                                <div className={style.sidebar}>
                                    <input type="range" id="position" min="0" max="8" step="1" onInput={() => client.current?.rerender()} className={style.position} />
                                    <div className={style.side}>
                                        <div className={style.layers_div}>
                                            <div style={{ marginRight: "0.5rem" }}>
                                                <input type="checkbox" id="first_layer" name="first_layer" onInput={() => client.current?.rerender()} defaultChecked/>
                                                <label htmlFor="first_layer">Первый слой</label>
                                            </div>
                                            <div>
                                                <input type="checkbox" id="second_layer" name="second_layer" onInput={() => client.current?.rerender()} defaultChecked/>
                                                <label htmlFor="second_layer">Второй слой</label>
                                            </div>
                                        </div>
                                        <div>
                                            <h3>Слой повязки</h3>
                                            <select name="layers" id="layers" onChange={() => client.current?.rerender()} defaultValue={0}>
                                                <option value="0">На разных слоях</option>
                                                <option value="1">Только на первом слое</option>
                                                <option value="2">Только на втором слое</option>
                                            </select>
                                        </div>
                                        <div>
                                            <h3>Часть тела</h3>
                                            <select name="body_part" id="body_part" onChange={() => client.current?.rerender()}>
                                                <option value="0">Левая рука</option>
                                                <option value="1">Левая нога</option>
                                                <option value="2">Правая рука</option>
                                                <option value="3">Правая нога</option>
                                            </select>
                                        </div>
                                    </div>
                                </div>
                                <div>
                                    <input type="checkbox" id="clear" name="clear" onInput={() => client.current?.rerender()} />
                                    <label htmlFor="clear">Очистить пиксели на втором слое рядом с повязкой</label>
                                </div>

                            </div>
                        </AccordionItem>
                        <AccordionItem header="4. Скачать готовый скин" dark={dark}>
                            <div className={style.styles_main} style={{ display: "flex", alignItems: "center", paddingBottom: "1rem" }}>
                                <canvas id="result_skin_canvas" width="64" height="64" style={{ width: 64, height: 64 }}></canvas>
                                <div style={{display: "flex", flexDirection: "column", alignItems: "flex-start"}}>
                                    <button onClick={download_skin} className={`${style.clear_skin} ${dark ? style.dark : ""}`} style={{ marginLeft: "5px" }}>Скачать</button>
                                    <button onClick={() => {
                                            const skin_canvas = document.getElementById('original_canvas') as HTMLCanvasElement;
                                            const out_canvas = document.getElementById("result_skin_canvas") as HTMLCanvasElement;
                                            const ctx = skin_canvas.getContext('2d', { willReadFrequently: true }) as Context;

                                            ctx.clearRect(0, 0, 64, 64);
                                            ctx.drawImage(out_canvas, 0, 0);
                                            toggle('item-1', true);
                                        }
                                    } className={`${style.clear_skin} ${dark ? style.dark : ""}`} style={{ marginLeft: "5px" }}>Использовать этот скин как исходный</button>
                                </div>
                            </div>
                        </AccordionItem>
                    </ControlledAccordion>
                </div>
            </main>
        </body>

*/