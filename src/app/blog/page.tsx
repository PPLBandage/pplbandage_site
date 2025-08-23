import { ArticleServer } from '@/components/blog/Article.server';
import { getLayoutContents } from '@/lib/blog/loader';
import style from '@/styles/blog/main.module.css';

const Blog = async () => {
    const articles = await getLayoutContents();
    const sorted_articles = Object.entries(articles)
        .reverse()
        .sort((a, b) => {
            if (a[1].pinned && !b[1].pinned) return -1;
            if (!a[1].pinned && b[1].pinned) return 1;

            return (
                new Date(b[1].created).getTime() - new Date(a[1].created).getTime()
            );
        });

    return (
        <main className={style.main}>
            <h2 style={{ marginTop: 0, marginBottom: '2rem' }}>
                Последние новости проекта PPLBandage
            </h2>
            <div className={style.grid}>
                {sorted_articles.map(([slug, article], id) => (
                    <ArticleServer
                        key={id}
                        id={id}
                        article={article}
                        href={`/blog/${slug}`}
                    />
                ))}
            </div>
        </main>
    );
};

export default Blog;
