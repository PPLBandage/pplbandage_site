import { IconEdit, IconUser } from '@tabler/icons-react';
import Link from 'next/link';
import style from '@/styles/editor/page.module.css';
import * as Interfaces from '@/types/global.d';
import { LinkedText } from '@/components/workshop/LinkedText';
import TagElement from './TagElement';
import { formatDate } from '@/lib/time';

const Info = ({ el, onClick }: { el: Interfaces.Bandage; onClick(): void }) => {
    const tags = el.tags.map((tag, index) => (
        <TagElement key={index} title={tag} />
    ));
    return (
        <div className={style.info_container}>
            <h2
                className={
                    `${style.title} ` +
                    `${el.permissions_level >= 1 && style.title_editable}`
                }
            >
                {el.title}
                <IconEdit
                    className={style.edit_icon}
                    width={24}
                    height={24}
                    onClick={() => el.permissions_level >= 1 && onClick()}
                />
            </h2>
            {el.description && (
                <p className={style.description}>
                    <LinkedText text={el.description} />
                </p>
            )}
            <div className={style.tags_container}>{tags}</div>
            <span className={style.author_cont}>
                {el.author.public ? (
                    <Link
                        className={style.author}
                        href={`/users/${el.author.username}`}
                    >
                        <IconUser width={24} height={24} />
                        {el.author.name}
                    </Link>
                ) : (
                    <a className={`${style.author} ${style.username_private}`}>
                        <IconUser width={24} height={24} />
                        {el.author.name}
                    </a>
                )}
                <span style={{ opacity: '.8' }}>•</span>
                <span style={{ opacity: '.8', fontSize: '1rem' }}>
                    {formatDate(new Date(el.creation_date))}
                </span>
            </span>
        </div>
    );
};

export default Info;
