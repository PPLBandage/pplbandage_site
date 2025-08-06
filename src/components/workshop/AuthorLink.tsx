import { Bandage } from '@/types/global';
import { IconUser } from '@tabler/icons-react';
import style_card from '@/styles/workshop/card.module.css';
import Link from 'next/link';

export const AuthorLink = ({ author }: { author: Bandage['author'] }) => {
    if (!author.public)
        return (
            <span
                className={`${style_card.username} ${style_card.username_private}`}
            >
                <IconUser style={{ width: '1.5rem' }} />
                {author.name}
            </span>
        );

    return (
        <Link className={style_card.username} href={`/users/${author.username}`}>
            <IconUser style={{ width: '1.5rem' }} />
            {author.name}
        </Link>
    );
};
