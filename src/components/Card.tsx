import { Bandage, Category } from '@/types/global.d';
import Style from '@/styles/workshop/page.module.css';
import style_card from '@/styles/workshop/card.module.css';
import NextImage from 'next/image';
import { getCookie } from 'cookies-next';
import Link, { LinkProps } from 'next/link';
import { CSSProperties, ReactNode, useEffect, useState } from 'react';

import {
    IconCircleHalf2,
    IconEyeOff,
    IconPlus,
    IconStar,
    IconStarFilled,
    IconUser
} from '@tabler/icons-react';
import { getIcon } from '@/lib/Categories';
import { usePathname, useRouter } from 'next/navigation';
import { StaticTooltip } from './Tooltip';
import ApiManager from '@/lib/apiManager';
import { useConfigContext } from '@/lib/ConfigContext';
import IconCandle from '@/resources/stars/candle.svg';
import IconCandleOn from '@/resources/stars/candle_on.svg';
import { useNextCookie } from 'use-next-cookie';
import { CustomLink } from './Search';
import { formatDate } from '@/lib/time';

interface CategoryProps {
    category: Category;
    enabled?: boolean;
    onClick?(): void;
    hoverable?: boolean;
    style?: CSSProperties;
}

export const CategoryEl = ({
    category,
    enabled,
    onClick,
    hoverable,
    style
}: CategoryProps) => {
    return (
        <div
            key={category.id}
            className={`${Style.category} ${
                enabled && Style.enabled_category
            } ${hoverable && Style.hoverable}`}
            onClick={() => onClick && onClick()}
            style={style}
        >
            {getIcon(category.icon)}
            <p>{category.name}</p>
        </div>
    );
};

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
};

interface CategoryShortenProps {
    category: Category;
    style?: CSSProperties;
    parent_id: string;
}

export const CategoryShorten = ({ category, style }: CategoryShortenProps) => {
    return (
        <StaticTooltip key={category.id} title={category.name}>
            <div className={`${style_card.category_shorten}`} style={style}>
                {getIcon(category.icon)}
            </div>
        </StaticTooltip>
    );
};

export const constrain = (val: number, min_val: number, max_val: number) => {
    return Math.min(max_val, Math.max(min_val, val));
};

const backgrounds: { [key: string]: string } = {
    amoled: 'amoled',
    default: 'default'
};

interface ReferrerLinkProps
    extends Omit<React.AnchorHTMLAttributes<HTMLAnchorElement>, 'href'>,
        LinkProps {
    children: ReactNode;
    href: string;
}

export const ReferrerLink: React.FC<ReferrerLinkProps> = ({
    children,
    href,
    ...props
}) => {
    const pathname = usePathname();
    const router = useRouter();
    const context = useConfigContext();

    const handleTransition = async (
        e: React.MouseEvent<HTMLAnchorElement, MouseEvent>
    ) => {
        e.preventDefault();
        if (pathname.endsWith(href)) return;
        window.sessionStorage.setItem('referrer', pathname);
        if (context && context.lastConfig) {
            const scroll = window.scrollY || document.documentElement.scrollTop;
            window.sessionStorage.setItem(
                'workshopState',
                JSON.stringify({ ...context.lastConfig, scroll })
            );
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

    let StarIcon = undefined;

    switch (el.star_type) {
        case 1:
            StarIcon = starred ? IconCandleOn : IconCandle;
            break;
        default:
            StarIcon = starred ? IconStarFilled : IconStar;
            break;
    }

    return (
        <div
            className={style_card.star_container}
            onClick={() => {
                // eslint-disable-next-line @typescript-eslint/no-unused-expressions
                logged ? setStarred(prev => !prev) : router.push('/me');
            }}
        >
            <StarIcon
                className={style_card.star}
                width={el.star_type === 0 ? 24 : undefined}
                height={24}
                color={el.star_type === 0 ? '#ffb900' : undefined}
                id={el.external_id + '_star'}
                style={{ width: el.star_type === 0 ? 24 : 18 } as CSSProperties}
            />
            <span
                className={style_card.star_count}
                id={el.external_id + '_text'}
            >
                {starsCount}
            </span>
        </div>
    );
};

export const Card = ({
    el,
    base64,
    className
}: {
    el: Bandage;
    base64: string;
    className?: { readonly [key: string]: string };
}) => {
    const theme = useNextCookie('theme_main', 1000);
    const background = backgrounds[theme] ?? 'default';

    const categories = el.categories.map(category => (
        <div id={`category_${category.id}_${el.id}`} key={category.id}>
            <CategoryShorten
                category={category}
                parent_id={`category_${category.id}_${el.id}`}
            />
        </div>
    ));

    return (
        <article
            className={`${style_card.card} ${className?.skin_description_props}`}
            style={{
                background: `url('/static/backgrounds/background_${background}.svg')`
            }}
        >
            <div className={style_card.head_container}>
                <StarElement el={el} />

                <div className={style_card.extra_params}>
                    {el.access_level < 2 && (
                        <StaticTooltip title="Скрыта">
                            <IconEyeOff width={24} height={24} />
                        </StaticTooltip>
                    )}
                    {el.split_type && (
                        <StaticTooltip title="Раздельные модельки">
                            <IconCircleHalf2 width={24} height={24} />
                        </StaticTooltip>
                    )}
                </div>
            </div>
            <div
                style={
                    {
                        position: 'relative',
                        '--shadow-color': el.accent_color
                    } as React.CSSProperties
                }
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
                        draggable="false"
                    />
                </ReferrerLink>
                <div className={style_card.categories}>{categories}</div>
            </div>
            <div className={style_card.about}>
                <div>
                    <ReferrerLink
                        className={style_card.title}
                        href={`/workshop/${el.external_id}`}
                    >
                        {el.title}
                    </ReferrerLink>
                    <p className={style_card.description}>
                        {constrainedText(el.description ?? '', 50)}
                    </p>
                </div>

                <div>
                    {el.author.public ? (
                        <Link
                            className={style_card.username}
                            href={`/users/${el.author.username}`}
                        >
                            <IconUser style={{ width: '1.5rem' }} />
                            {el.author.name}
                        </Link>
                    ) : (
                        <Link
                            href={
                                el.author.public
                                    ? `/users/${el.author.username}`
                                    : ''
                            }
                            className={`${style_card.username} ${
                                !el.author.public && style_card.username_private
                            }`}
                        >
                            <IconUser style={{ width: '1.5rem' }} />
                            {el.author.name}
                        </Link>
                    )}
                    <p className={style_card.creation_date}>
                        {formatDate(new Date(el.creation_date))}
                    </p>
                </div>
            </div>
        </article>
    );
};

export const CreateCard = ({ first }: { first?: boolean }) => {
    const theme = useNextCookie('theme_main', 1000);
    const background = backgrounds[theme] ?? 'default';
    return (
        <article
            className={`${style_card.card} ${style_card.create_card}`}
            style={
                {
                    background: `url('/static/backgrounds/background_${background}.svg')`,
                    '--background-size': first ? '200px' : '40%'
                } as CSSProperties
            }
        >
            <NextImage
                src={'/static/peepo.png'}
                alt="peepo"
                width={123}
                height={128}
                className={style_card.peepo}
                priority
            />
            <Link href="/workshop/create">
                <IconPlus width={50} height={50} />
            </Link>
            <div>
                <h2>
                    {first
                        ? 'Создайте свою первую повязку'
                        : 'Создать новую повязку'}
                </h2>
                <p>
                    Не знаете как? Прочитайте{' '}
                    <CustomLink href="/tutorials/bandage">
                        наш туториал
                    </CustomLink>
                </p>
            </div>
        </article>
    );
};
