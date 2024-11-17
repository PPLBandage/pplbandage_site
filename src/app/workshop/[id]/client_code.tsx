"use client";

import React, { useCallback } from 'react';
import { useEffect, useState, useRef } from 'react';

import style from "@/app/styles/editor/page.module.css";
import * as Interfaces from "@/app/interfaces";
import { useRouter } from "next/navigation";

import axios from "axios";

import Client, { b64Prefix } from "./bandage_engine.module";
import SkinView3D from "@/app/modules/components/skinView.module";

import Header from "@/app/modules/components/header.module";
import Searcher from "@/app/modules/components/nick_search.module";
import { CategoryEl } from '@/app/modules/components/card.module';
import NextImage from 'next/image';
import Select from 'react-select';
import debounce from 'lodash.debounce';
import NavigatorEl from '@/app/modules/components/navigator.module';
import { authApi } from '@/app/modules/utils/api.module';
import CategorySelector from '@/app/modules/components/category_selector.module';
import Footer from '@/app/modules/components/footer.module';
import { anims } from '@/app/workshop/poses';
import asyncImage from '@/app/modules/components/asyncImage.module';
import Link from 'next/link';
import { CSSTransition } from 'react-transition-group';

import { IconDownload, IconPlus, IconChevronDown, IconUser, IconEdit, IconX, IconCheck, IconArchive } from '@tabler/icons-react';
import Slider from '@/app/modules/components/slider.module';
import SlideButton from '@/app/modules/components/slideButton.module';


const body_part: readonly { value: number, label: String }[] = [
    { value: 0, label: "Левая рука" },
    { value: 1, label: "Левая нога" },
    { value: 2, label: "Правая рука" },
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

export default function Home({ data }: { data: Interfaces.Bandage }) {
    const [loaded, setLoaded] = useState<boolean>(false);
    const categories = data.categories.map((category) => <CategoryEl key={category.id} category={category} />);

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
        // из за частого вызова oninput на слабых клиентах сильно лагает,
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
                <NavigatorEl path={[
                    { name: 'Мастерская', url: '/workshop' },
                    { name: data.external_id, url: `/workshop/${data.external_id}` }
                ]}
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
                    <div className={style.skin_parent}>
                        <SkinView3D SKIN={skin}
                            CAPE={cape}
                            slim={slim}
                            className={style.render_canvas}
                            pose={pose}
                            background='/static/background_big.png'
                            id='canvas_container' />
                        <div className={style.render_footer}>
                            <button className={style.skin_load} onClick={() => setLoadExpanded(true)}><IconPlus width={24} height={24} />Загрузить скин</button>
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
                        <div className={style.categories}>
                            {categories}
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
                                onClose={() => {
                                    setEdit(false);
                                    window.location.reload();
                                }}
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


const RawBandageDownload = ({ client, bandage }: { client: React.MutableRefObject<Client>, bandage: string }) => {
    const [expanded, setExpanded] = useState<boolean>(false);

    return (
        <div style={{ position: 'relative' }}>
            <button className={style.skin_load}
                onClick={() => setExpanded(prev => !prev)}
                style={{ width: '100%' }}
            >
                Скачать повязку
                <IconChevronDown
                    width={24}
                    height={24}
                    style={{
                        transform: `rotate(${expanded ? '180deg' : '0deg'})`,
                        transition: 'transform 250ms',
                        marginLeft: '.2rem'
                    }}
                />
            </button>
            <CSSTransition
                in={expanded}
                timeout={150}
                classNames={{
                    enter: style['menu-enter-bandage'],
                    enterActive: style['menu-enter-bandage-active'],
                    exit: style['menu-exit-bandage'],
                    exitActive: style['menu-exit-bandage-active'],
                }}
                unmountOnExit>
                <div className={style.bandage_raw_menu}>
                    <button className={style.skin_load} style={{ width: '100%' }} onClick={() => client.current?.download(b64Prefix + bandage, 'bandage.png')}>
                        Исходный файл
                    </button>
                    <button className={style.skin_load} style={{ width: '100%' }} onClick={() => client.current?.rerender(false, true)}>
                        Обработанная
                    </button>
                </div>
            </CSSTransition>
        </div>
    );
}

const Info = ({ el, onClick }: { el: Interfaces.Bandage, onClick(): void }) => {
    return <div className={style.info_container}>
        <h2 className={`${style.title} ${el.permissions_level >= 1 && style.title_editable}`} onClick={() => { if (el.permissions_level >= 1) onClick() }}>
            {el.title}
            <IconEdit className={style.edit_icon} width={24} height={24} /></h2>
        {el.description && <p className={style.description}>{el.description}</p>}
        {el.author ?
            el.author.public ?
                <Link className={style.author} href={`/users/${el.author.username}`}><IconUser width={24} height={24} />{el.author.name}</Link> :
                <a className={`${style.author} ${style.username_private}`}><IconUser width={24} height={24} />{el.author.name}</a> :
            <a className={`${style.author} ${style.username_private}`}><IconUser width={24} height={24} />Unknown</a>
        }
    </div>
}

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
        axios.get(process.env.NEXT_PUBLIC_API_URL + `minecraft/skin/${nickname}?cape=true`, { validateStatus: () => true }).then((response) => {
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
            asyncImage(reader.result as string).then(img => {
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
            <Searcher onChange={(evt) => loadSkin(evt)} />
            <label className={style.skin_drop}
                id="drop_container"
                onDragOver={(evt) => ondragover(evt)}
                onDragLeave={(_) => ondragleave()}
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
            {data && <div style={{ display: 'flex', justifyContent: 'center' }}>
                <NextImage src={data.data} width={64} height={64} alt='' />
            </div>
            }
            <div style={{ display: 'flex', width: '100%', gap: '.5rem' }}>
                <button className={style.skin_load} onClick={() => onChange(null)} style={{ width: '2.7rem' }}>
                    <IconX width={24} height={24} style={{ margin: 0 }} />
                </button>
                <button className={`${style.skin_load} ${!loaded && style.disabled_load}`} onClick={() => { loaded && onChange(data) }} style={{ width: '100%' }}>
                    <IconCheck width={24} height={24} style={{ marginRight: '.2rem' }} />Готово
                </button>
            </div>
        </div>
    </div>
}

const access_level: readonly { value: number, label: String }[] = [
    { value: 0, label: "Ограниченный доступ" },
    { value: 1, label: "Доступ только по ссылке" },
    { value: 2, label: "Открытый доступ" }
];

const EditElement = ({ bandage, onClose }: { bandage: Interfaces.Bandage, onClose(): void }) => {
    const router = useRouter();
    const [title, setTitle] = useState<string>(bandage.title);
    const [description, setDescription] = useState<string>(bandage.description);
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

    function capitalize(string: string) {
        return string.charAt(0).toUpperCase() + string.slice(1);
    }

    const save = () => {
        authApi.put(`workshop/${bandage.external_id}`, {
            title: title,
            description: description || null,
            categories: categories,
            access_level: accessLevel
        }).then((response) => {
            if (response.status === 200) {
                onClose();
                return;
            }
            if (response.status === 400) {
                if (typeof response.data.message === 'object') {
                    alert(response.data.message.map((str: string) => capitalize(str)).join('\n') || `Unhandled error: ${response.status}`);
                } else {
                    alert(response.data.message_ru || response.data.message);
                }
            }
        })
    }
    return <div style={{ display: "flex", flexDirection: "column", gap: ".8rem" }}>
        {bandage.permissions_level >= 2 ? <>
            <textarea maxLength={50} placeholder="Заголовок" className={style.textarea} onInput={(ev) => setTitle((ev.target as HTMLTextAreaElement).value)} value={title} />
            <textarea maxLength={300} placeholder="Описание" className={style.textarea} onInput={(ev) => setDescription((ev.target as HTMLTextAreaElement).value)} value={description} />
        </> :
            <>
                <h2 className={style.title}>{bandage.title}</h2>
                {bandage.description && <p className={style.description} style={{ margin: 0 }}>{bandage.description}</p>}
            </>}
        <CategorySelector enabledCategories={bandage.categories}
            allCategories={allCategories}
            onChange={setCategories} />
        <Select
            options={access_level}
            defaultValue={access_level[bandage.access_level]}
            className={`react-select-container`}
            classNamePrefix="react-select"
            isSearchable={false}
            onChange={(n, _) => setAccessLevel(n.value)}
        />
        <div className={style.check_notification} style={{
            borderColor: "red",
            backgroundColor: "rgba(255, 0, 0, .13)",
            margin: 0
        }}>
            <h3>Опасная зона</h3>
            <p>Все действия в данной зоне имеют необратимый характер, делайте их с умом!</p>

            <div style={{
                display: 'flex',
                alignItems: 'center',
                flexDirection: 'row',
                gap: '.4rem',
                marginTop: '1rem',
                marginBottom: '.4rem'
            }}>
                <div className={style.deleteButton} onClick={() => {
                    const first = confirm(`Вы собираетесь удалить повязку ${bandage.title}! Это действе необратимо! Подтверждаете?`);
                    if (!first) return;
                    const second = confirm('Последний шанс! Удалить?');
                    if (!second) return;
                    authApi.delete(`workshop/${bandage.external_id}`).then(res => {
                        if (res.status === 200) {
                            router.replace('/workshop');
                        }
                    })
                }}>
                    <img className={style.binUp} alt="" src="/static/icons/bin_up.png"></img>
                    <img className={style.binDown} alt="" src="/static/icons/bin_down.png"></img>
                </div>
                <p style={{ margin: 0 }}>Удалить повязку</p>
            </div>
            <div style={{
                display: 'flex',
                alignItems: 'center',
                gap: '.4rem'
            }}>
                <button className={style.archiveButton} onClick={_ => {
                    if (!confirm('Заархивировать повязку? После архивации её будет невозможно изменить!')) return;
                    authApi.put(`workshop/${bandage.external_id}/archive`).then(res => {
                        if (res.status !== 200) {
                            alert(res.data.message);
                            return
                        }
                        window.location.reload();
                    })
                }}><IconArchive /></button>
                <p style={{ margin: 0 }}>Архивировать</p>
            </div>
        </div>
        <button className={style.skin_load} onClick={() => save()} style={{ padding: ".4rem" }}>Сохранить</button>
    </div>
}