import { ArticleServer } from '@/components/blog/Article.server';
import { getLayoutContents } from '@/lib/blog/loader';
import style from '@/styles/blog/main.module.css';
import { LayoutContent } from '@/types/blog';

const Blog = async () => {
    const articles = await getLayoutContents();
    const sorted_articles = Object.entries(articles)
        .reverse()
        .sort(
            (a, b) =>
                new Date(b[1].created).getTime() - new Date(a[1].created).getTime()
        );

    const pinned = sorted_articles.filter(i => i[1].pinned);
    const regular = sorted_articles.filter(i => !i[1].pinned);

    const renderArticles = (data: [string, LayoutContent][]) => {
        return data.map(([slug, article], id) => (
            <ArticleServer
                key={id}
                id={id}
                article={article}
                href={`/blog/${slug}`}
            />
        ));
    };

    return (
        <main className={style.main}>
            <h2 style={{ marginTop: 0, marginBottom: '2rem' }}>
                Последние новости проекта PPLBandage
            </h2>
            <h3>Закреплённые</h3>
            <div className={style.grid}>{renderArticles(pinned)}</div>
            <hr style={{ marginTop: '1.5rem', marginBottom: '1.5rem' }} />
            <div className={style.grid}>{renderArticles(regular)}</div>
        </main>
    );
};

export default Blog;
