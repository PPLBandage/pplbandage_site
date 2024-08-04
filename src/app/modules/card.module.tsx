import { authApi } from "./api.module";
import { Bandage, Category } from "../interfaces";
import Style from "../styles/workshop/page.module.css";
import NextImage from 'next/image';
import { fillPepe } from "../workshop/[id]/bandage_engine.module";
import { getCookie } from "cookies-next";
import Link from "next/link";
import { CSSProperties, useEffect, useState } from "react";

const b64Prefix = "data:image/png;base64,";

export const generateSkin = (b64: string, colorable: boolean): Promise<string> => {
    return new Promise((resolve, reject) => {
        const bandage = new Image();
        bandage.src = b64Prefix + b64;

        bandage.onload = () => {
            const height = Math.floor(bandage.height / 2);
            const skin_canvas = document.createElement("canvas") as HTMLCanvasElement;
            skin_canvas.width = 64;
            skin_canvas.height = 64;

            const skin = new Image();
            skin.onload = () => {
                const context = skin_canvas.getContext("2d");
                if (context) {
                    context.drawImage(skin, 0, 0);

                    const position = 6 - Math.floor(height / 2);

                    let bandage_new: HTMLCanvasElement | HTMLImageElement;
                    if (colorable) {
                        bandage_new = fillPepe(bandage, [randint(0, 255), randint(0, 255), randint(0, 255)]);
                    } else {
                        bandage_new = bandage;
                    }

                    context.drawImage(bandage_new, 0, 0, 16, height, 48, 52 + position, 16, height);
                    context.drawImage(bandage_new, 0, height, 16, height, 32, 52 + position, 16, height);

                    const result = skin_canvas.toDataURL();
                    resolve(result);
                } else {
                    reject(new Error("Failed to get 2D context"));
                }
            };
            skin.onerror = () => reject(new Error("Failed to load skin image"));
            skin.src = "/static/workshop_base.png";
        };

        bandage.onerror = () => reject(new Error("Failed to load bandage image"));
    });
};


export const formatDate = (date: Date) => {
    if (isNaN(date.getDay())) return "";
    const hours = date.getHours().toString().padStart(2, '0');
    const minutes = date.getMinutes().toString().padStart(2, '0');
    const day = date.getDate().toString().padStart(2, '0');
    const month = (date.getMonth() + 1).toString().padStart(2, '0');
    const year = date.getFullYear().toString();
    return `${hours}:${minutes} ${day}.${month}.${year}`;
}


export const randint = (min: number, max: number): number => {
    return Math.random() * (max - min) + min;
}

export const CategoryEl = ({ category, enabled, onClick, hoverable, style }: { category: Category, enabled?: boolean, onClick?(): void, hoverable?: boolean, style?: CSSProperties }) => {
    return (
        <div key={category.id} className={`${Style.category} ${enabled && Style.enabled_category} ${hoverable && Style.hoverable}`} onClick={() => onClick()} style={style}>
            <NextImage src={category.icon} alt={category.name} width={15} height={15} />
            <p>{category.name}</p>
        </div>
    );
}

export const Card = ({ el, base64, className }: { el: Bandage, base64: string, className?: { readonly [key: string]: string; } }): JSX.Element => {
    const [starred, setStrarred] = useState<boolean>(el.starred);
    const [last, setLast] = useState<boolean>(el.starred);
    const logged = getCookie("sessionId");

    const categories = el.categories.map((category) => {
        if (category.icon === "/null") return undefined;
        return <CategoryEl key={category.id} category={category} />
    })

    useEffect(() => {
        if (logged && starred != last) {
            authApi.put(`/star/${el.external_id}`, {}, { params: { set: starred } }).then((response) => {
                if (response.status == 200) {
                    const response_data: { new_count: number, action_set: boolean } = response.data;
                    (document.getElementById(el.external_id + "_star") as HTMLImageElement)
                        .src = `/static/icons/star${!response_data.action_set ? "_empty" : ""}.svg`;
                    (document.getElementById(el.external_id + "_text") as HTMLSpanElement)
                        .textContent = response_data.new_count.toString();
                }
            }).finally(() => {
                setLast(starred);
            });
        }
    }, [starred]);

    return (
        <div key={el.id}>
            <div className={`${Style.head_container} ${className?.skin_description_props}`}>
                <div className={Style.star_container}>
                    <NextImage
                        src={`/static/icons/star${!starred ? "_empty" : ""}.svg`}
                        className={Style.star}
                        draggable="false"
                        alt="star"
                        width={24}
                        height={24}
                        id={el.external_id + "_star"}
                        style={logged ? { cursor: "pointer" } : {}}
                        onClick={() => { if (logged) setStrarred(prev => !prev) }} />
                    <span className={Style.star_count} id={el.external_id + "_text"}>{el.stars_count}</span>
                </div>
                {el.split_type && <NextImage src="/static/icons/split_types.svg"
                    className={Style.split_type}
                    alt=""
                    width={24}
                    height={24} />}
            </div>
            <Link href={`/workshop/${el.external_id}`}>
                <NextImage src={base64} className={`${Style.skin} ${className?.skin_props}`} alt={el.external_id} width={300} height={300} draggable="false" />
            </Link>
            <div className={`${Style.skin_descr} ${className?.skin_description_props}`}>
                <Link className={Style.header} href={`/workshop/${el.external_id}`}>{el.title}</Link>
                <p className={Style.description}>{el.description}</p>
                <div className={Style.categories}>{categories}</div>

                <Link className={Style.username} href={`/users/${el.author.username}`}><img alt="" src="/static/icons/user.svg" style={{ width: "1.5rem" }} />{el.author.name || "Unknown"}</Link>
                <p className={Style.creation_date}>{formatDate(new Date(el.creation_date))}</p>
            </div>
        </div>
    );
}

export const constrain = (val: number, min_val: number, max_val: number) => {
    return Math.min(max_val, Math.max(min_val, val))
}