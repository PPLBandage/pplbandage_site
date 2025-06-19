import { Bandage } from '@/types/global.d';
import style_card from '@/styles/workshop/card.module.css';
import NextImage from 'next/image';
import Link from 'next/link';
import { CSSProperties } from 'react';

import {
    IconCircleDashedX,
    IconCircleHalf2,
    IconEyeOff,
    IconHourglassHigh,
    IconPalette,
    IconPlus,
    IconUser
} from '@tabler/icons-react';
import { StaticTooltip } from '@/components/Tooltip';
import { CustomLink } from '@/components/workshop/Search';
import { formatDate } from '@/lib/time';
import { removeLink } from '@/components/workshop/LinkedText';
import { constrainedText } from '@/lib/textUtils';
import ReferrerLink from './ReferrerLink';
import TagElement from './TagElement';
import StarElement from './Star';

export const Card = ({
    el,
    base64,
    className
}: {
    el: Bandage;
    base64: string;
    className?: { readonly [key: string]: string };
}) => {
    const tagsEl = el.tags.map(tag => <TagElement title={tag} key={tag} />);

    return (
        <article
            className={`${style_card.card} ${className?.skin_description_props}`}
        >
            <div className={style_card.head_container}>
                <StarElement el={el} />

                <div className={style_card.extra_params}>
                    {Boolean(el.flags & 1) && (
                        <StaticTooltip title="Окрашиваемая">
                            <IconPalette width={24} height={24} />
                        </StaticTooltip>
                    )}
                    {el.access_level < 2 && (
                        <StaticTooltip title="Скрыта">
                            <IconEyeOff width={24} height={24} />
                        </StaticTooltip>
                    )}
                    {Boolean(el.flags & (1 << 1)) && (
                        <StaticTooltip title="Раздельные модельки">
                            <IconCircleHalf2 width={24} height={24} />
                        </StaticTooltip>
                    )}
                    {Boolean(el.flags & (1 << 4)) && (
                        <StaticTooltip title="Отклонена">
                            <IconCircleDashedX
                                width={24}
                                height={24}
                                color="#dc2626"
                            />
                        </StaticTooltip>
                    )}
                    {Boolean(el.flags & (1 << 3)) && (
                        <StaticTooltip title="На рассмотрении">
                            <IconHourglassHigh
                                width={24}
                                height={24}
                                color="#FFC107"
                            />
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
                        {constrainedText(removeLink(el.description) ?? '', 50)}
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
                    <CustomLink href="/tutorials/bandage">
                        наш туториал
                    </CustomLink>
                </p>
            </div>
        </article>
    );
};
