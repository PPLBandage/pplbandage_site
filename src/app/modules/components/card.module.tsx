import { authApi } from "@/app/modules/utils/api.module";
import { Bandage, Category } from "@/app/interfaces";
import Style from "@/app/styles/workshop/page.module.css";
import NextImage from 'next/image';
import { getCookie } from "cookies-next";
import Link from "next/link";
import { CSSProperties, useEffect, useState } from "react";

import { IconCircleHalf2, IconStar, IconStarFilled, IconUser } from '@tabler/icons-react';
import { getIcon } from "../utils/categories.module";
import { useRouter } from "next/navigation";


export const formatDate = (date: Date) => {
    if (isNaN(date.getDay())) return '';
    const hours = date.getHours().toString().padStart(2, '0');
    const minutes = date.getMinutes().toString().padStart(2, '0');
    const day = date.getDate().toString().padStart(2, '0');
    const month = (date.getMonth() + 1).toString().padStart(2, '0');
    const year = date.getFullYear().toString();
    return `${hours}:${minutes} ${day}.${month}.${year}`;
}

interface CategoryProps {
    category: Category,
    enabled?: boolean,
    onClick?(): void,
    hoverable?: boolean,
    style?: CSSProperties
}

export const CategoryEl = ({ category, enabled, onClick, hoverable, style }: CategoryProps) => {
    return (
        <div key={category.id} className={`${Style.category} ${enabled && Style.enabled_category} ${hoverable && Style.hoverable}`} onClick={() => onClick && onClick()} style={style}>
            {getIcon(category.icon)}
            <p>{category.name}</p>
        </div>
    );
}

export const Card = ({ el, base64, className }: { el: Bandage, base64: string, className?: { readonly [key: string]: string; } }): JSX.Element => {
    const [starred, setStarred] = useState<boolean>(el.starred);
    const [last, setLast] = useState<boolean>(el.starred);
    const logged = getCookie("sessionId");
    const router = useRouter();

    const categories = el.categories.map((category) => <CategoryEl key={category.id} category={category} />);

    useEffect(() => {
        if (logged && starred != last) {
            authApi.put(`/star/${el.external_id}`, {}, { params: { set: starred } }).then((response) => {
                if (response.status == 200) {
                    const response_data: { new_count: number, action_set: boolean } = response.data;
                    (document.getElementById(el.external_id + "_text") as HTMLSpanElement)
                        .textContent = response_data.new_count.toString();
                }
            }).finally(() => {
                setLast(starred);
            });
        }
    }, [starred]);

    return (
        <div key={el.id} style={{ position: 'relative' }}>
            <div className={`${Style.head_container} ${className?.skin_description_props}`}>
                <div className={Style.star_container}>
                    {starred ?
                        <IconStarFilled
                            className={Style.star}
                            width={24}
                            height={24}
                            color="#ffb900"
                            id={el.external_id + "_star"}
                            style={{ cursor: "pointer" }}
                            onClick={() => { logged ? setStarred(prev => !prev) : router.push('/me') }} /> :
                        <IconStar
                            className={Style.star}
                            width={24}
                            height={24}
                            color="#ffb900"
                            id={el.external_id + "_star"}
                            style={{ cursor: "pointer" }}
                            onClick={() => { logged ? setStarred(prev => !prev) : router.push('/me') }} />
                    }
                    <span className={Style.star_count} id={el.external_id + "_text"}>{el.stars_count}</span>
                </div>
                {
                    el.split_type && <IconCircleHalf2
                        className={Style.split_type}
                        width={24}
                        height={24}
                    />
                }
            </div>
            <Link href={`/workshop/${el.external_id}`}>
                <NextImage
                    src={base64}
                    className={`${Style.skin} ${className?.skin_props}`}
                    alt={el.external_id}
                    width={300}
                    height={300}
                    draggable='false'
                    style={{ '--shadow-color': el.accent_color } as React.CSSProperties}
                />
            </Link>
            <div className={`${Style.skin_descr} ${className?.skin_description_props}`}>
                <Link className={Style.header} href={`/workshop/${el.external_id}`}>{el.title}</Link>
                <p className={Style.description}>{el.description}</p>
                <div className={Style.categories}>{categories}</div>

                {el.author.public ?
                    <Link className={Style.username} href={!!el.author.name ? `/users/${el.author.username}` : ``}><IconUser style={{ width: "1.5rem" }} />{el.author.name || "Unknown"}</Link> :
                    <a className={`${Style.username} ${Style.username_private}`}><IconUser style={{ width: "1.5rem" }} />{el.author.name || "Unknown"}</a>
                }
                <p className={Style.creation_date}>{formatDate(new Date(el.creation_date))}</p>
            </div>
        </div>
    );
}

export const constrain = (val: number, min_val: number, max_val: number) => {
    return Math.min(max_val, Math.max(min_val, val))
}