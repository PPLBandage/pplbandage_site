import style from '@/app/styles/tutorials/common.module.css';
import { getLayoutContents, getMdContents } from './loaders';
import { MDXRemote } from 'next-mdx-remote/rsc';
import { Note, Warn, Tip, Accent } from './components/Blocks';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import { IconArrowNarrowRight } from '@tabler/icons-react';

const Post = async ({ params }: { params: Promise<{ slug: string }> }) => {
    const props = await params;
    const layout = await getLayoutContents();
    const article = layout.find(page => page.slug === props.slug);
    if (!article) notFound();

    const contents = await getMdContents(article.url);
    return (
        <main className={style.main}>
            <div className={style.main_container}>
                <div className={style.back_to_blog_container}>
                    <Link href="/blog" className={style.back_to_blog}>
                        <IconArrowNarrowRight
                            width={20}
                            height={20}
                            strokeWidth={1.5}
                        />
                        Вернуться в назад
                    </Link>
                </div>
                <MDXRemote
                    source={contents}
                    components={{ Note, Warn, Tip, Accent }}
                />
            </div>
        </main>
    );
};

export default Post;
