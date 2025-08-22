import { ArticleServer } from '@/components/blog/Article.server';
import { getLayoutContents } from '@/lib/blog/loader';
import style from '@/styles/blog/main.module.css';

const Blog = async () => {
    const articles = await getLayoutContents();

    return (
        <main className={style.main}>
            <div className={style.grid}>
                {Object.entries(articles)
                    .reverse()
                    .sort(
                        (a, b) =>
                            new Date(b[1].created).getTime() -
                            new Date(a[1].created).getTime()
                    )
                    .map(([slug, article], id) => (
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
