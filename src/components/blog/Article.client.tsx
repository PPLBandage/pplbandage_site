'use client';

import styles from '@/styles/blog/article.module.css';
import link_style from '@/styles/customLink.module.css';
import Image from 'next/image';
import Link from 'next/link';
import { ArticleProps } from './Article.server';
import { StaticTooltip } from '../Tooltip';
import { IconPin } from '@tabler/icons-react';

const Authors = ({ names, category }: { names: string[]; category: string }) => {
    const authors = names.slice(-3);
    return (
        <div className={styles.authors_category_container}>
            <div
                className={styles.avatars_container}
                style={{ right: category ? -13 : 0 }}
            >
                {authors.map((name, index) => (
                    <StaticTooltip
                        title={name}
                        container_styles={{
                            right: `-${13 * (authors.length - 1 - index)}px`,
                            display: 'flex'
                        }}
                        tooltip_styles={{ minWidth: 'max-content' }}
                        key={index}
                    >
                        <Image
                            className={styles.avatars}
                            src={`https://github.com/${name}.png?size=24`}
                            alt={name}
                            width={24}
                            height={24}
                        />
                    </StaticTooltip>
                ))}
                {authors.length < names.length && (
                    <div className={styles.avatars_plus}>
                        +{names.length - authors.length}
                    </div>
                )}
            </div>
            {category && <p className={styles.category_container}>{category}</p>}
        </div>
    );
};

const Article = (
    props: ArticleProps & {
        date: string;
        rendered_description: React.ReactNode | null;
    }
) => {
    return (
        <article className={styles.article}>
            <div className={styles.body}>
                <div className={styles.header}>
                    <span className={styles.date_cont}>
                        {props.article.pinned && (
                            <StaticTooltip title="Закреплено">
                                <IconPin width={20} height={20} />
                            </StaticTooltip>
                        )}
                        {props.date}
                    </span>
                    <Authors
                        names={[
                            ...props.article.collaborators,
                            props.article.author
                        ]}
                        category={props.article.category}
                    />
                </div>
                <Link className={styles.title} href={props.href}>
                    {props.article.title}
                </Link>
                {props.article.description && (
                    <div className={`${styles.description} ${link_style.link_cont}`}>
                        {props.rendered_description}
                    </div>
                )}
            </div>
            <Link className={styles.read_more} href={props.href}>
                Читать далее
            </Link>
        </article>
    );
};

export default Article;
