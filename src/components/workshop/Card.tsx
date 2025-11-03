import { Bandage } from '@/types/global.d';
import style_card from '@/styles/workshop/card.module.css';
import NextImage from 'next/image';
import Link from 'next/link';
import { CSSProperties, useEffect, useRef, useState } from 'react';

import {
    IconCircleDashedX,
    IconCircleHalf2,
    IconEyeOff,
    IconHourglassHigh,
    IconPalette,
    IconPlus
} from '@tabler/icons-react';
import { StaticTooltip } from '@/components/Tooltip';
import { CustomLink } from '@/components/workshop/Search';
import { formatDate } from '@/lib/time';
import { removeLink } from '@/components/workshop/TextFormatter';
import { constrainedText } from '@/lib/textUtils';
import ReferrerLink from './ReferrerLink';
import TagElement from './TagElement';
import StarElement from './Star';
import { AuthorLink } from './AuthorLink';
import { renderQueue } from '@/lib/workshop/RenderingQueue';

const ExtraParams = ({
    flags,
    access_level
}: {
    flags: number;
    access_level: number;
}) => {
    return (
        <div className={style_card.extra_params}>
            {Boolean(flags & 1) && (
                <StaticTooltip title="Окрашиваемая">
                    <IconPalette width={24} height={24} />
                </StaticTooltip>
            )}
            {access_level < 2 && (
                <StaticTooltip title="Скрыта">
                    <IconEyeOff width={24} height={24} />
                </StaticTooltip>
            )}
            {Boolean(flags & (1 << 1)) && (
                <StaticTooltip title="Раздельные модельки">
                    <IconCircleHalf2 width={24} height={24} />
                </StaticTooltip>
            )}
            {Boolean(flags & (1 << 4)) && (
                <StaticTooltip title="Отклонена">
                    <IconCircleDashedX width={24} height={24} color="#dc2626" />
                </StaticTooltip>
            )}
            {Boolean(flags & (1 << 3)) && (
                <StaticTooltip title="На рассмотрении">
                    <IconHourglassHigh width={24} height={24} color="#FFC107" />
                </StaticTooltip>
            )}
        </div>
    );
};

export const CreateCard = ({ first }: { first?: boolean }) => {
    return (
        <article
            className={`${style_card.card} ${style_card.create_card}`}
            style={
                {
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
                    <CustomLink href="/blog/bandage">наш туториал</CustomLink>
                </p>
            </div>
        </article>
    );
};

const QueuedSkinImage = ({ data }: { data: Bandage }) => {
    const imageRef = useRef<HTMLImageElement>(null);
    const [rendered, setRendered] = useState<boolean>(false);

    async function render() {
        if (!imageRef.current) return;
        imageRef.current.src = await renderQueue.enqueue({
            b64: data.base64,
            flags: data.flags
        });
        setRendered(true);
    }

    useEffect(() => {
        void render();
    }, []);
    return (
        <img
            ref={imageRef}
            className={`${style_card.skin} ${!rendered && style_card.skin_loading}`}
            alt={data.external_id}
            width={300}
            height={300}
            draggable="false"
        />
    );
};

export const Card = ({
    el,
    className
}: {
    el: Bandage;
    className?: { readonly [key: string]: string };
}) => {
    let el_tags = el.tags;
    if (el_tags.includes('Официальные'))
        el_tags = ['Официальные', ...el_tags.filter(el => el !== 'Официальные')];

    const tagsEl = el_tags.map(tag => <TagElement title={tag} key={tag} />);

    return (
        <article
            className={`${style_card.card} ${className?.skin_description_props}`}
        >
            <div className={style_card.head_container}>
                <StarElement el={el} />
                <ExtraParams flags={el.flags} access_level={el.access_level} />
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
                    style={{ display: 'flex', overflow: 'hidden' }}
                >
                    <QueuedSkinImage key={el.id} data={el} />
                </ReferrerLink>
                <div className={style_card.tags}>{tagsEl}</div>
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
                        {removeLink(constrainedText(el.description ?? '', 50))}
                    </p>
                </div>

                <div>
                    <AuthorLink author={el.author} />
                    <p className={style_card.creation_date}>
                        {formatDate(new Date(el.creation_date))}
                    </p>
                </div>
            </div>
        </article>
    );
};
