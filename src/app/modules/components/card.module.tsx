import { authApi } from "@/app/modules/utils/api.module";
import { Bandage, Category } from "@/app/interfaces";
import Style from "@/app/styles/workshop/page.module.css";
import style_card from "@/app/styles/workshop/card.module.css";
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


export const constrain = (val: number, min_val: number, max_val: number) => {
    return Math.min(max_val, Math.max(min_val, val))
}

export const Card = ({ el, base64, className }: { el: Bandage, base64: string, className?: { readonly [key: string]: string; } }) => {
    const [starred, setStarred] = useState<boolean>(el.starred);
    const [last, setLast] = useState<boolean>(el.starred);
    const logged = getCookie("sessionId");
    const router = useRouter();

    const categories = el.categories.map(category => <CategoryEl key={category.id} category={category} />);

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

    const StarIcon = starred ? IconStarFilled : IconStar;

    return (
        <article className={`${style_card.card}  ${className?.skin_description_props}`}>

            <div className={style_card.head_container}>
                <div className={style_card.star_container}>
                    <StarIcon
                        className={style_card.star}
                        width={24}
                        height={24}
                        color="#ffb900"
                        id={el.external_id + "_star"}
                        style={{ cursor: "pointer" }}
                        onClick={() => { logged ? setStarred(prev => !prev) : router.push('/me') }}
                    />
                    <span className={style_card.star_count} id={el.external_id + "_text"}>{el.stars_count}</span>
                </div>

                {
                    el.split_type &&
                    <IconCircleHalf2
                        width={24}
                        height={24}
                    />
                }
            </div>
            <Link href={`/workshop/${el.external_id}`}>
                <NextImage
                    src={base64}
                    className={style_card.skin}
                    alt={el.external_id}
                    width={300}
                    height={300}
                    draggable='false'
                    style={{ '--shadow-color': el.accent_color } as React.CSSProperties}
                />
            </Link>
            <div className={style_card.about}>
                <div>
                    <Link className={style_card.title} href={`/workshop/${el.external_id}`}>{el.title}</Link>
                    <p className={style_card.description}>{el.description}</p>
                    <div className={style_card.categories}>{categories}</div>
                </div>

                <div>
                    {el.author.public ?
                        <Link className={style_card.username} href={!!el.author.name ? `/users/${el.author.username}` : ``}><IconUser style={{ width: "1.5rem" }} />{el.author.name || "Unknown"}</Link> :
                        <a className={`${style_card.username} ${style_card.username_private}`}><IconUser style={{ width: "1.5rem" }} />{el.author.name || "Unknown"}</a>
                    }
                    <p className={style_card.creation_date}>{formatDate(new Date(el.creation_date))}</p>
                </div>
            </div>
        </article>
    )
}