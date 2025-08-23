import { formatDateHuman } from '@/lib/time';
import { LayoutContent } from '@/types/blog';
import Article from './Article.client';
import { MDXRemote } from 'next-mdx-remote/rsc';

export type ArticleProps = {
    id: number;
    article: LayoutContent;
    href: string;
};

export const ArticleServer = (props: ArticleProps) => {
    const date = formatDateHuman(new Date(props.article.created));

    return (
        <Article
            {...props}
            date={date}
            rendered_description={
                props.article.description ? (
                    <MDXRemote source={props.article.description} />
                ) : null
            }
        />
    );
};
