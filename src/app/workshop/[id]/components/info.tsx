import { IconEdit, IconUser } from '@tabler/icons-react';
import Link from 'next/link';
import style from '@/styles/editor/page.module.css';
import * as Interfaces from '@/types/global.d';
import { CategoryEl } from '@/components/Card';

const Info = ({ el, onClick }: { el: Interfaces.Bandage; onClick(): void }) => {
    const categories = el.categories.map(category => (
        <CategoryEl key={category.id} category={category} />
    ));

    return (
        <div className={style.info_container}>
            <h2
                className={`${style.title} ${
                    el.permissions_level >= 1 && style.title_editable
                }`}
            >
                {el.title}
                <IconEdit
                    className={style.edit_icon}
                    width={24}
                    height={24}
                    onClick={() => {
                        if (el.permissions_level >= 1) onClick();
                    }}
                />
            </h2>
            {el.description && (
                <p className={style.description}>{el.description}</p>
            )}
            {categories.length > 0 && (
                <div className={style.categories}>{categories}</div>
            )}
            {el.author ? (
                el.author.public ? (
                    <Link
                        className={style.author}
                        href={`/users/${el.author.username}`}
                    >
                        <IconUser width={24} height={24} />
                        {el.author.name}
                    </Link>
                ) : (
                    <a
                        className={`${style.author}
                ${style.username_private}`}
                    >
                        <IconUser width={24} height={24} />
                        {el.author.name}
                    </a>
                )
            ) : (
                <a className={`${style.author} ${style.username_private}`}>
                    <IconUser width={24} height={24} />
                    Unknown
                </a>
            )}
        </div>
    );
};

export default Info;
