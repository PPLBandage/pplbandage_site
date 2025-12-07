import { Bandage } from '@/types/global';
import { IconUser } from '@tabler/icons-react';
import style_card from '@/styles/workshop/card.module.css';
import Link from 'next/link';
import Image from 'next/image';

export const AuthorLink = ({
    author,
    renderAvatar
}: {
    author: Bandage['author'];
    renderAvatar?: boolean;
}) => {
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
            {renderAvatar ? (
                <Image
                    className={style_card.avatar}
                    alt={author.name}
                    src={
                        process.env.NEXT_PUBLIC_DOMAIN +
                        `/api/v1/avatars/${author.id}`
                    }
                    width={24}
                    height={24}
                    style={{ width: '1.5rem', height: 'auto' }}
                />
            ) : (
                <IconUser style={{ width: '1.5rem', marginRight: '-.3rem' }} />
            )}
            {author.name}
        </Link>
    );
};
