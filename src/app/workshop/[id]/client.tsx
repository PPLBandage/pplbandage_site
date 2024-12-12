"use client";

import React, { useCallback } from 'react';
import { useEffect, useState, useRef } from 'react';

import style from "@/app/styles/editor/page.module.css";
import * as Interfaces from "@/app/interfaces";

import Client, { b64Prefix } from "./bandage_engine";
import SkinView3D from "@/app/modules/components/SkinView";

import Header from "@/app/modules/components/Header";
import Select from 'react-select';
import debounce from 'lodash.debounce';
import NavigatorEl from '@/app/modules/components/Navigator';
import Footer from '@/app/modules/components/Footer';
import { anims } from '@/app/workshop/poses';
import asyncImage from '@/app/modules/utils/asyncImage';
import { CSSTransition } from 'react-transition-group';

import { IconDownload, IconPlus } from '@tabler/icons-react';
import Slider from '@/app/modules/components/Slider';
import SlideButton from '@/app/modules/components/SlideButton';
import SkinLoad from './skinLoad';
import EditElement from './components/edit';
import Info from './components/info';
import RawBandageDownload from './components/rawBandageDownload';
import { StarElement } from '@/app/modules/components/Card';


const body_part: readonly { value: number, label: String }[] = [
    { value: 0, label: "Левая рука" },
    { value: 2, label: "Правая рука" },
    { value: 1, label: "Левая нога" },
    { value: 3, label: "Правая нога" }
];

const layers: readonly { value: string, label: String }[] = [
    { value: "0", label: "На разных слоях" },
    { value: "1", label: "Только на первом слое" },
    { value: "2", label: "Только на втором слое" }
];

const getRandomColor = () => {
    const letters = '0123456789ABCDEF';
    let color = '#';
    for (var i = 0; i < 6; i++) {
        color += letters[Math.floor(Math.random() * 16)];
    }
    return color;
}

const componentToHex = (c: number) => {
    const hex = c.toString(16);
    return hex.length == 1 ? "0" + hex : hex;
}

export const rgbToHex = (r: number, g: number, b: number) => {
    return "#" + componentToHex(r) + componentToHex(g) + componentToHex(b);
}

const generatePath = (
    external_id: string,
    referrer_str: string | null,
    author: string | undefined
) => {
    const names: { [key: string]: { name: string, url: string } } = {
        workshop: { name: 'Мастерская', url: '/workshop' },
        me: { name: 'Личный кабинет', url: '/me' },
        stars: { name: 'Избранное', url: '/me/stars' },
        notifications: { name: 'Уведомления', url: '/me/notifications' }
    };

    const default_path = [
        { name: 'Мастерская', url: '/workshop' },
        { name: external_id, url: `/workshop/${external_id}` }
    ];

    const referrer = referrer_str ?? window.sessionStorage.getItem('referrer');
    window.sessionStorage.removeItem('referrer');

    if (!referrer || referrer === window.location.pathname) {
        return default_path;
    }

    let result;
    if (referrer.startsWith('/users') && !!author) {
        const username = referrer.split('/').reverse()[0];
        result = [{ name: author, url: `/users/${username}` }];
    } else {
        result = referrer.split('/').slice(1).map(page => names[page]);
        if (result.some(page => !page)) return default_path;
    }

    return [...result, { name: external_id, url: `/workshop/${external_id}` }];
}

export default function Home({ data, referrer }: { data: Interfaces.Bandage, referrer: string | null }) {
    const [loaded, setLoaded] = useState<boolean>(false);
    const [navPath, setNavPath] = useState<{ name: string, url: string }[]>([]);

    const [pose, setPose] = useState<number>(1);
    const [skin, setSkin] = useState<string>("");
    const [cape, setCape] = useState<string>("");
    const [slim, setSlim] = useState<boolean>(false);
    const [edit, setEdit] = useState<boolean>(false);

    const [randomColor, setRandomColor] = useState<string>("");
    const [loadExpanded, setLoadExpanded] = useState<boolean>(false);
    const [rangeProps, setRangeProps] = useState<{ max: number, value: number }>({ max: 8, value: 4 });
    const client = useRef<Client>();


    const debouncedHandleColorChange = useCallback(
        // из-за частого вызова oninput на слабых клиентах сильно лагает,
        // поэтому сделан дебаунс на 5мс
        debounce(event => {
            client.current.setParams({ color: event.target.value });
        }, 5),
        []
    );

    const adjustColor = () => {
        const color = client.current.calcColor();
        const selector = document.getElementById('color_select') as HTMLInputElement;

        selector.value = rgbToHex(~~color.r, ~~color.g, ~~color.b);
        client.current.setParams({ color: selector.value });
        client.current.rerender();
    }

    useEffect(() => {
        setNavPath(generatePath(data.external_id, referrer, data.author?.name));

        if (referrer) {
            const url = new URL(window.location.toString());
            url.search = '';
            window.history.replaceState({}, document.title, url);
        }

        client.current = new Client();
        client.current.addEventListener('skin_changed', (event: { skin: string, cape: string }) => {
            setSkin(event.skin);
            setCape(event.cape);
            setSlim(client.current.slim);
        });

        client.current.addEventListener('init', () => {
            if (data.me_profile) client.current.loadSkin(data.me_profile.uuid);

            asyncImage(b64Prefix + data.base64).then(bandage => {
                const height = bandage.height / 2;
                const pepe_canvas = document.createElement('canvas') as HTMLCanvasElement;
                const context_pepe = pepe_canvas.getContext('2d');
                pepe_canvas.width = 16;
                pepe_canvas.height = height;

                const lining_canvas = document.createElement('canvas') as HTMLCanvasElement;
                const context_lining = lining_canvas.getContext('2d');
                lining_canvas.width = 16;
                lining_canvas.height = height;

                context_pepe.drawImage(bandage, 0, 0, 16, height, 0, 0, 16, height);
                context_lining.drawImage(bandage, 0, height, 16, height, 0, 0, 16, height);
                client.current.pepe_canvas = pepe_canvas;
                client.current.lining_canvas = lining_canvas;
                client.current.position = 6 - Math.floor(height / 2);
                setRangeProps({ value: client.current.position, max: (12 - client.current.pepe_canvas.height) });
                client.current.colorable = data.categories.some(val => val.colorable);
                const randomColor = getRandomColor();
                setRandomColor(randomColor);
                client.current.setParams({ color: randomColor });
                client.current.rerender();
                setLoaded(true);
            });

            if (data.split_type) {
                client.current.setParams({ split_types: true });
                asyncImage(b64Prefix + data.base64_slim).then(img => {
                    client.current.loadFromImage(img, true)
                });
            }
        });
        scrollTo(0, 0);
    }, []);

    return (
        <body>
            <Header />
            <CSSTransition
                in={loadExpanded}
                timeout={230}
                classNames={{
                    enter: style['menu-enter'],
                    enterActive: style['menu-enter-active'],
                    exit: style['menu-exit'],
                    exitActive: style['menu-exit-active'],
                }}
                unmountOnExit>
                <SkinLoad onChange={evt => {
                    evt && client.current?.changeSkin(evt.data, evt.slim, evt.cape ? 'data:image/png;base64,' + evt.cape : '');
                    setLoadExpanded(false);
                }} />
            </CSSTransition>

            <main
                className={style.main}
                style={loaded ? { opacity: '1', transform: 'translateY(0)' } : { opacity: '0', transform: 'translateY(50px)' }}
            >
                <NavigatorEl path={navPath}
                    style={{ marginBottom: "1rem" }} />
                {
                    data.check_state ?
                        data.check_state === "under review" ?
                            <div className={style.check_notification}>
                                <h3>На проверке</h3>
                                <p>Ваша работа сейчас проходит модерацию, дождитесь ее завершения</p>
                            </div>
                            :
                            <div className={style.check_notification} style={{ borderColor: "red", backgroundColor: "rgba(255, 0, 0, .13)" }}>
                                <h3>Отклонено</h3>
                                <p>Ваша работа была отклонена модерацией. Для получения информации обратитесь в поддержку</p>
                            </div>
                        : null
                }
                <div className={style.main_container}>
                    <div className={style.skin_parent} style={{ position: 'relative' }}>
                        <div style={{
                            position: 'absolute',
                            boxSizing: 'border-box',
                            width: '100%',
                            zIndex: 5,
                            padding: '.3rem'
                        }}>
                            <StarElement el={data} />
                        </div>
                        <SkinView3D SKIN={skin}
                            CAPE={cape}
                            slim={slim}
                            className={style.render_canvas}
                            pose={pose}
                            background='/static/background_big.png'
                            id='canvas_container' />
                        <div className={style.render_footer}>
                            <button
                                className={style.skin_load}
                                onClick={() => setLoadExpanded(true)}>
                                <IconPlus width={24} height={24} />Загрузить скин
                            </button>
                            <Select
                                options={anims}
                                defaultValue={anims[pose]}
                                className={`react-select-container`}
                                classNamePrefix='react-select'
                                isSearchable={false}
                                onChange={(n, _) => setPose(n.value)}
                                formatOptionLabel={nick_value => nick_value.label} />
                            <SlideButton
                                onChange={val => client.current?.changeSlim(val)}
                                value={slim} label="Тонкие руки" />
                            <button className={style.skin_load} onClick={() => client.current?.download()}>
                                <IconDownload
                                    width={24}
                                    height={24} />
                                Скачать скин
                            </button>
                            <RawBandageDownload
                                client={client}
                                bandage={slim ? data.base64_slim : data.base64} />
                        </div>
                    </div>
                    <div style={{ width: "100%" }}>
                        {!edit ?
                            <Info
                                el={data}
                                onClick={() => setEdit(true)}
                            /> :
                            <EditElement
                                bandage={data}
                                onDone={() => {
                                    setEdit(false);
                                    window.location.reload();
                                }}
                                onClose={() => setEdit(false)}
                            />
                        }
                        <hr />
                        <div style={{ display: "flex", flexDirection: "column", gap: ".8rem" }}>
                            {client.current?.colorable &&
                                <div style={{ display: "flex", alignItems: "center", flexWrap: 'wrap', gap: '.5rem' }}>
                                    <button onClick={adjustColor} className={style.adjust_color}>Подобрать цвет</button>
                                    <div style={{ display: "flex", alignItems: "center" }}>
                                        <input
                                            type='color'
                                            id='color_select'
                                            defaultValue={randomColor}
                                            onInput={debouncedHandleColorChange}
                                            style={{ cursor: 'pointer' }}
                                        />
                                        <p style={{ margin: 0, marginLeft: '.5rem' }}>Выберите цвет</p>
                                    </div>
                                </div>
                            }
                            <div className={style.settings_slider}>
                                <Slider
                                    initial={rangeProps.value}
                                    range={rangeProps.max}
                                    onChange={val => client.current?.setParams({ position: val })}
                                />
                                <div className={style.settings_slider_1}>
                                    <SlideButton onChange={val => client.current?.setParams({ first_layer: val })}
                                        defaultValue={true}
                                        label='Первый слой' />

                                    <SlideButton onChange={val => client.current?.setParams({ second_layer: val })}
                                        defaultValue={true}
                                        label='Второй слой' />

                                    <SlideButton onChange={val => client.current?.setParams({ clear_pix: val })}
                                        defaultValue={true}
                                        label='Очищать пиксели на втором слое' />

                                    <Select
                                        options={body_part}
                                        defaultValue={body_part[0]}
                                        className={`react-select-container`}
                                        classNamePrefix="react-select"
                                        isSearchable={false}
                                        onChange={(n, _) => client.current?.setParams({ body_part: n.value })} />
                                    <Select
                                        options={layers}
                                        defaultValue={layers[0]}
                                        className={`react-select-container`}
                                        classNamePrefix="react-select"
                                        isSearchable={false}
                                        onChange={(n, _) => client.current?.setParams({ layers: n.value })} />
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