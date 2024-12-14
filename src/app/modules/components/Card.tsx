import { Bandage, Category } from "@/app/interfaces";
import Style from "@/app/styles/workshop/page.module.css";
import style_card from "@/app/styles/workshop/card.module.css";
import NextImage from 'next/image';
import { getCookie } from "cookies-next";
import Link, { LinkProps } from "next/link";
import { CSSProperties, ReactNode, useEffect, useState } from "react";

import { IconCircleHalf2, IconEyeOff, IconStar, IconStarFilled, IconUser } from '@tabler/icons-react';
import { getIcon } from "../utils/Categories";
import { usePathname, useRouter } from "next/navigation";
import { UseGlobalTooltip } from "./Tooltip";
import useCookie from "../utils/useCookie";
import ApiManager from "../utils/apiManager";
import { useConfigContext } from "@/app/modules/utils/ConfigContext";


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

const constrainedText = (string: string, max_length: number): string => {
    const words = string.split(' ');
    for (let x = 0; x < words.length; x++) {
        if (words[0].length > max_length) {
            return string.slice(0, max_length) + '...';
        }
        if (words.slice(0, x).join(' ').length > max_length) {
            return words.slice(0, x - 1).join(' ') + '...';
        }
    }
    return string;
}

interface CategoryShortenProps {
    category: Category,
    style?: CSSProperties,
    parent_id: string
}

export const CategoryShorten = ({ category, style, parent_id }: CategoryShortenProps) => {
    return (
        <UseGlobalTooltip
            key={category.id}
            opacity="1"
            text={category.name}
        >
            <div className={`${style_card.category_shorten}`} style={style}>
                {getIcon(category.icon)}
            </div>
        </UseGlobalTooltip>
    );
}


export const constrain = (val: number, min_val: number, max_val: number) => {
    return Math.min(max_val, Math.max(min_val, val))
}

const backgrounds: { [key: string]: string } = {
    amoled: 'amoled',
    default: 'default'
}

interface ReferrerLinkProps
    extends Omit<React.AnchorHTMLAttributes<HTMLAnchorElement>, "href">,
    LinkProps {
    children: ReactNode;
    href: string;
}

export const ReferrerLink: React.FC<ReferrerLinkProps> = ({ children, href, ...props }) => {
    const pathname = usePathname();
    const router = useRouter();
    const context = useConfigContext();

    const handleTransition = async (e: React.MouseEvent<HTMLAnchorElement, MouseEvent>) => {
        e.preventDefault();
        if (pathname.endsWith(href)) return;
        window.sessionStorage.setItem('referrer', pathname);
        if (context && context.lastConfig) {
            const scroll = window.scrollY || document.documentElement.scrollTop;
            window.sessionStorage.setItem('workshopState', JSON.stringify({ ...context.lastConfig, scroll }));
        }
        router.push(href);
    };

    return (
        <Link {...props} href={href} onClick={handleTransition}>
            {children}
        </Link>
    );
};

export const StarElement = ({ el }: { el: Bandage }) => {
    const logged = getCookie('sessionId');
    const router = useRouter();
    const [starred, setStarred] = useState<boolean>(el.starred);
    const [last, setLast] = useState<boolean>(el.starred);
    const [starsCount, setStarsCount] = useState<number>(el.stars_count);

    useEffect(() => {
        if (logged && starred != last) {
            ApiManager.setStar(el.external_id, { set: starred })
                .then(data => setStarsCount(data.new_count))
                .catch(console.error)
                .finally(() => setLast(starred));
        }
    }, [starred]);

    const StarIcon = starred ? IconStarFilled : IconStar;

    return (
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
            <span className={style_card.star_count} id={el.external_id + "_text"}>{starsCount}</span>
        </div>
    )
}

export const Card = ({ el, base64, className }: { el: Bandage, base64: string, className?: { readonly [key: string]: string; } }) => {
    const theme = useCookie('theme_main');
    const background = backgrounds[theme] ?? 'default';

    const categories = el.categories.map(category =>
        <div id={`category_${category.id}_${el.id}`} key={category.id}>
            <CategoryShorten category={category} parent_id={`category_${category.id}_${el.id}`} />
        </div>
    );

    return (
        <article
            className={`${style_card.card}  ${className?.skin_description_props}`}
            style={{ background: `url('/static/backgrounds/background_${background}.svg')` }}
        >
            <div className={style_card.head_container}>
                <StarElement el={el} />

                <div style={{ display: 'flex', gap: '3px' }}>
                    {el.access_level < 2 && <IconEyeOff width={24} height={24} />}
                    {el.split_type && <IconCircleHalf2 width={24} height={24} />}
                </div>
            </div>
            <div
                style={{ position: 'relative', '--shadow-color': el.accent_color } as React.CSSProperties}
                className={style_card.gradient_background}
            >
                <ReferrerLink
                    href={`/workshop/${el.external_id}`}
                    style={{ display: 'flex' }}
                >

                    <NextImage
                        src={base64}
                        className={style_card.skin}
                        alt={el.external_id}
                        width={300}
                        height={300}
                        draggable='false'
                    />
                </ReferrerLink>
                <div className={style_card.categories}>{categories}</div>
            </div>
            <div className={style_card.about}>
                <div>
                    <ReferrerLink className={style_card.title} href={`/workshop/${el.external_id}`}>{el.title}</ReferrerLink>
                    <p className={style_card.description}>{constrainedText(el.description ?? '', 50)}</p>
                </div>

                <div>
                    {el.author ?
                        el.author.public ?
                            <Link className={style_card.username} href={`/users/${el.author.username}`}><IconUser style={{ width: "1.5rem" }} />{el.author.name}</Link> :
                            <a className={`${style_card.username} ${style_card.username_private}`}><IconUser style={{ width: "1.5rem" }} />{el.author.name}</a> :
                        <a className={`${style_card.username} ${style_card.username_private}`}><IconUser style={{ width: "1.5rem" }} />Unknown</a>
                    }
                    <p className={style_card.creation_date}>{formatDate(new Date(el.creation_date))}</p>
                </div>
            </div>
        </article>
    )
}