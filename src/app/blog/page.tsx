import { getLayoutContents, REPO_NAME, REPO_OWNER } from './[slug]/loaders';
import Article from './components/Article';
import styles from '@/app/styles/blog/page.module.css';

const Blog = async () => {
    const articles = await getLayoutContents();
    console.log(articles);

    return (
        <main className={styles.main}>
            <div className={styles.grid}>
                {articles.map((article, index) => (
                    <Article
                        key={index}
                        id={index}
                        tag={article.tag}
                        title={article.name}
                        description={article.description}
                        href={`/blog/${article.slug}`}
                        thumbnail={`https://raw.githubusercontent.com/${REPO_OWNER}/${REPO_NAME}/main${article.thumbnail}`}
                    />
                ))}
            </div>
        </main>
    );
};

export default Blog;
