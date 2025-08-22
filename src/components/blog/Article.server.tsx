import { formatDateHuman } from '@/lib/time';
import { LayoutContent } from '@/types/blog';
import Article from './Article.client';

export type ArticleProps = {
    id: number;
    article: LayoutContent;
    href: string;
};

export const ArticleServer = (props: ArticleProps) => {
    const date = formatDateHuman(new Date(props.article.created));

    return <Article {...props} date={date} />;
};
