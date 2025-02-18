'use client';
import styles from '@/app/styles/blog/article.module.css';
import { Roboto } from 'next/font/google';
import Link from 'next/link';
import { CSSProperties } from 'react';

const roboto = Roboto({ subsets: ['latin'], weight: ['700'] });

type ArticleProps = {
    id: number;
    title: string;
    description: string;
    href: string;
    thumbnail: string;
    tag: string;
};

const Article = (props: ArticleProps) => {
    return (
        <Link
            href={props.href}
            className={styles.body}
            style={
                {
                    '--background-img': `url(${props.thumbnail})`,
                    animationDelay: `${props.id * 150}ms`
                } as CSSProperties
            }
        >
            <div className={styles.text_container}>
                <span className={`${styles.tag} ${roboto.className}`}>
                    {props.tag}
                </span>
                <h1>{props.title}</h1>
                <span className={styles.description}>{props.description}</span>
            </div>
        </Link>
    );
};

export default Article;
