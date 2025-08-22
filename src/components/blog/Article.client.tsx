'use client';

import styles from '@/styles/blog/article.module.css';
import Image from 'next/image';
import Link from 'next/link';
import { ArticleProps } from './Article.server';
import { StaticTooltip } from '../Tooltip';

const Authors = ({ names }: { names: string[] }) => {
    const authors = names.slice(-3);
    return (
        <div className={styles.avatars_container}>
            {authors.map((name, index) => (
                <StaticTooltip
                    title={name}
                    container_styles={{
                        right: `-${13 * (authors.length - 1 - index)}px`
                    }}
                    tooltip_styles={{ minWidth: 'max-content' }}
                    key={index}
                >
                    <Image
                        className={styles.avatars}
                        src={`https://github.com/${name}.png?size=30`}
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
    );
};

const Article = (props: ArticleProps & { date: string }) => {
    return (
        <article className={styles.article}>
            <div className={styles.body}>
                <div className={styles.header}>
                    <span className={styles.date}>{props.date}</span>
                    <Authors
                        names={[
                            ...props.article.collaborators,
                            props.article.author
                        ]}
                    />
                </div>
                <Link className={styles.title} href={props.href}>
                    {props.article.title}
                </Link>
                <p className={styles.description}>{props.article.description}</p>
            </div>
            <Link className={styles.read_more} href={props.href}>
                Читать далее
            </Link>
        </article>
    );
};

export default Article;
