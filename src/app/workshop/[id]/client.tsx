'use client';

import React, { useCallback } from 'react';
import { useEffect, useState, useRef } from 'react';

import style from '@/styles/editor/page.module.css';
import * as Interfaces from '@/types/global.d';

import Client, { b64Prefix } from '@/lib/workshop/bandageEngine';
import SkinView3D from '@/components/workshop/SkinView';

import Select from 'react-select';
import debounce from 'lodash.debounce';
import NavigatorEl from '@/components/workshop/Navigator';
import { anims } from '@/lib/workshop/poses';
import asyncImage from '@/lib/asyncImage';

import {
    IconArrowsVertical,
    IconDownload,
    IconEye,
    IconEyeCog,
    IconHelpCircleFilled,
    IconPlus
} from '@tabler/icons-react';
import Slider from '@/components/workshop/Slider';
import SlideButton from '@/components/SlideButton';
import SkinLoad from '@/components/workshop/SkinLoad';
import EditElement from '@/components/workshop/EditElement';
import RawBandageDownload from '@/components/workshop/RawBandageDownload';
import Moderation from '@/components/workshop/single/Moderation';
import ModeratorActions from '@/components/workshop/single/ModerationActions';
import { getRandomColor, rgbToHex } from '@/lib/colorUtils';
import { generatePath } from '@/lib/workshop/workshopPath';
import StarElement from '@/components/workshop/Star';
import Info from '@/components/workshop/info';
import { StaticTooltip } from '@/components/Tooltip';
import useRenderThumbnail from '@/lib/workshop/adminRenderThumbnail';

const body_part: readonly { value: number; label: string }[] = [
    { value: 0, label: 'Левая рука' },
    { value: 2, label: 'Правая рука' },
    { value: 1, label: 'Левая нога' },
    { value: 3, label: 'Правая нога' }
];

const layers: readonly { value: string; label: string }[] = [
    { value: '0', label: 'На разных слоях' },
    { value: '1', label: 'Только на первом слое' },
    { value: '2', label: 'Только на втором слое' }
];

export default function Bandage({
    data,
    referrer
}: {
    data: Interfaces.Bandage;
    referrer: string | null;
}) {
    useRenderThumbnail(data);
    const [loaded, setLoaded] = useState<boolean>(false);
    const [navPath, setNavPath] = useState<{ name: string; url: string }[]>([]);

    const [pose, setPose] = useState<number>(1);
    const [skin, setSkin] = useState<string>('');
    const [cape, setCape] = useState<string | null>(null);
    const [slim, setSlim] = useState<boolean>(false);
    const [edit, setEdit] = useState<boolean>(false);

    const [randomColor, setRandomColor] = useState<string>('');
    const [loadExpanded, setLoadExpanded] = useState<boolean>(false);
    const [rangeProps, setRangeProps] = useState<{
        max: number;
        value: number;
    }>({ max: 8, value: 4 });
    const client = useRef<Client>(undefined!);

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
    };

    useEffect(() => {
        setNavPath(generatePath(data.external_id, referrer, data.author?.name));

        if (referrer) {
            const url = new URL(window.location.toString());
            url.search = '';
            window.history.replaceState({}, document.title, url);
        }

        client.current = new Client();
        client.current.onRendered = event => {
            setSkin(event.skin);
            setCape(event.cape);
            setSlim(event.slim);
        };

        client.current.onInit = () => {
            client.current.loadSkinUrl('/api/v1/users/@me/autoload-skin');

            asyncImage(b64Prefix + data.base64).then(bandage => {
                client.current.loadFromImage(bandage);

                setRangeProps({
                    value: client.current.position,
                    max: 12 - client.current.pepe_canvas!.height
                });

                client.current.setParams({
                    colorable: Boolean(data.flags & 1)
                });
                if (client.current.colorable) {
                    const randomColor = getRandomColor();
                    setRandomColor(randomColor);
                    client.current.setParams({ color: randomColor });
                }
                setLoaded(true);
            });

            if (data.flags & (1 << 1)) {
                client.current.setParams({ split_types: true });
                asyncImage(b64Prefix + data.base64_slim).then(img =>
                    client.current.loadFromImage(img, true)
                );
            }
        };

        client.current.init();
        scrollTo(0, 0);
    }, []);

    return (
        <>
            <SkinLoad
                onChange={evt => {
                    if (evt) {
                        client.current?.loadSkinBase64(
                            evt.data,
                            evt.slim,
                            evt.cape ? b64Prefix + evt.cape : ''
                        );
                    }
                    setLoadExpanded(false);
                }}
                expanded={loadExpanded}
            />

            <main
                className={style.main}
                style={
                    loaded
                        ? { opacity: '1', transform: 'none' }
                        : { opacity: '0', transform: 'translateY(50px)' }
                }
            >
                <NavigatorEl path={navPath} style={{ marginBottom: '1rem' }} />
                {data.moderation && <Moderation moderation={data.moderation} />}
                <ModeratorActions data={data} />

                <div className={style.main_container}>
                    <div
                        className={style.skin_parent}
                        style={{ position: 'relative' }}
                    >
                        <div className={style.star_container}>
                            <StarElement el={data} />
                        </div>
                        <SkinView3D
                            SKIN={skin}
                            CAPE={cape ?? undefined}
                            slim={slim}
                            className={style.render_canvas}
                            pose={pose}
                            id="canvas_container"
                        />
                        <div className={style.render_footer}>
                            <button
                                className={style.skin_load}
                                onClick={() => setLoadExpanded(true)}
                            >
                                <IconPlus width={24} height={24} />
                                Загрузить скин
                            </button>
                            <SlideButton
                                onChange={val => client.current?.changeSlim(val)}
                                value={slim}
                                label="Тонкие руки"
                            />
                            <Select
                                options={anims}
                                defaultValue={anims[pose]}
                                className="react-select-container"
                                classNamePrefix="react-select"
                                isSearchable={false}
                                onChange={n => setPose(n!.value)}
                                instanceId="select-1"
                                formatOptionLabel={nick_value => nick_value.label}
                            />
                            <button
                                className={style.skin_load}
                                onClick={() => client.current?.download?.()}
                            >
                                <IconDownload width={24} height={24} />
                                Скачать скин
                            </button>
                            <RawBandageDownload
                                client={client}
                                bandage={slim ? data.base64_slim! : data.base64}
                            />
                        </div>
                        <span className={style.views}>
                            <IconEye width={16} height={16} /> {data.views}
                        </span>
                    </div>
                    <div style={{ width: '100%' }}>
                        {!edit ? (
                            <Info el={data} onClick={() => setEdit(true)} />
                        ) : (
                            <EditElement
                                bandage={data}
                                onDone={() => {
                                    setEdit(false);
                                    window.location.reload();
                                }}
                                onClose={() => setEdit(false)}
                            />
                        )}
                        <hr />
                        <div className={style.parameters_cont}>
                            <div className={style.parameters}>
                                <h3>
                                    <IconArrowsVertical />
                                    Расположение
                                </h3>
                                <div className={style.parameters_pos_body}>
                                    <span className={style.bandage_height_span}>
                                        Позиция повязки
                                    </span>
                                    <Slider
                                        initial={rangeProps.value}
                                        range={rangeProps.max}
                                        onChange={val =>
                                            client.current?.setParams({
                                                position: val
                                            })
                                        }
                                    />
                                    <hr />
                                    <div className={style.parameters_pos_selects}>
                                        <div
                                            className={
                                                style.parameters_pos_selects_container
                                            }
                                        >
                                            <span>Часть тела</span>
                                            <Select
                                                options={body_part}
                                                defaultValue={body_part[0]}
                                                className="react-select-container"
                                                classNamePrefix="react-select"
                                                isSearchable={false}
                                                instanceId="select-2"
                                                onChange={n =>
                                                    client.current?.setParams({
                                                        body_part: n!.value
                                                    })
                                                }
                                            />
                                        </div>

                                        <div
                                            className={
                                                style.parameters_pos_selects_container
                                            }
                                        >
                                            <span>Расположение на слоях</span>
                                            <Select
                                                options={layers}
                                                defaultValue={layers[0]}
                                                className="react-select-container"
                                                classNamePrefix="react-select"
                                                isSearchable={false}
                                                instanceId="select-3"
                                                onChange={n =>
                                                    client.current?.setParams({
                                                        layers: n!.value
                                                    })
                                                }
                                            />
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div className={style.parameters}>
                                <h3>
                                    <IconEyeCog />
                                    Отображение
                                </h3>
                                <div className={style.parameters_view_body}>
                                    {client.current?.colorable && (
                                        <div className={style.colorable_cont}>
                                            <button
                                                onClick={adjustColor}
                                                className={style.adjust_color}
                                            >
                                                Подобрать цвет
                                            </button>
                                            <div
                                                className={
                                                    style.colorable_selector_cont
                                                }
                                            >
                                                <input
                                                    type="color"
                                                    id="color_select"
                                                    defaultValue={randomColor}
                                                    onInput={
                                                        debouncedHandleColorChange
                                                    }
                                                    style={{ cursor: 'pointer' }}
                                                />
                                                <p className={style.colorable_p}>
                                                    Выберите цвет
                                                </p>
                                            </div>
                                        </div>
                                    )}
                                    <SlideButton
                                        onChange={val =>
                                            client.current?.setParams({
                                                first_layer: val
                                            })
                                        }
                                        defaultValue={true}
                                        label="Первый слой"
                                    />

                                    <SlideButton
                                        onChange={val =>
                                            client.current?.setParams({
                                                second_layer: val
                                            })
                                        }
                                        defaultValue={true}
                                        label="Второй слой"
                                    />

                                    <div className={style.clear_pixels_cont}>
                                        <SlideButton
                                            onChange={val =>
                                                client.current?.setParams({
                                                    clear_pix: val
                                                })
                                            }
                                            defaultValue={true}
                                            label="Очищать пиксели на втором слое"
                                        />
                                        <StaticTooltip
                                            title="Если на месте повязки на втором слое скина есть непрозрачные пиксели, они будут удалены"
                                            container_styles={{ display: 'flex' }}
                                            tooltip_styles={{ minWidth: '13rem' }}
                                        >
                                            <IconHelpCircleFilled
                                                width={16}
                                                height={16}
                                                opacity={0.6}
                                            />
                                        </StaticTooltip>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </main>
        </>
    );
}
