import style from '@/styles/blog/main.module.css';
import link_style from '@/styles/customLink.module.css';
import { MDXRemote } from 'next-mdx-remote/rsc';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import { IconArrowNarrowRight } from '@tabler/icons-react';
import { getLayoutContents, getMdContents } from '@/lib/blog/loader';
import {
    Code,
    NextAnchor,
    Note,
    SImage,
    SVideo,
    Tip,
    Warn
} from '@/components/blog/page/Blocks';
import Image from 'next/image';
import { Metadata } from 'next';
import { Emote } from '@/components/workshop/TextFormatter';

export const generateMetadata = async ({
    params
}: {
    params: Promise<{ slug: string }>;
}): Promise<Metadata> => {
    const props = await params;
    const layout = await getLayoutContents();

    const meta = layout[props.slug];
    if (!meta) return {};

    return {
        title: `${meta.title} · Повязки Pepeland`,
        description: meta.description,
        authors: [meta.author, ...meta.collaborators].map(a => ({
            name: a,
            url: `https://github.com/${a}`
        })),
        openGraph: {
            title: `${meta.title} · Повязки Pepeland`,
            description: meta.description
        }
    };
};

const Posters = (props: { authors: string[] }) => {
    return props.authors.map((name, index) => (
        <Link
            href={`https://github.com/${name}`}
            key={index}
            className={style.posters_container}
        >
            <Image
                className={style.avatars}
                src={`https://github.com/${name}.png?size=35`}
                alt={name}
                width={35}
                height={35}
            />
            <p>{name}</p>
        </Link>
    ));
};

const Post = async ({ params }: { params: Promise<{ slug: string }> }) => {
    const props = await params;
    const layout = await getLayoutContents();
    const meta = layout[props.slug];
    if (!meta) notFound();

    const contents = await getMdContents(props.slug);
    return (
        <main className={style.main}>
            <div className={style.back_to_blog_container}>
                <Link href="/blog" className={style.back_to_blog}>
                    <IconArrowNarrowRight width={20} height={20} strokeWidth={1.5} />
                    Вернуться назад
                </Link>
            </div>
            <h1 style={{ margin: 0 }}>{meta.title}</h1>
            {meta.description && (
                <div className={`${style.description} ${link_style.link_cont}`}>
                    <MDXRemote source={meta.description} />
                </div>
            )}
            <div className={style.posted_by}>
                <p style={{ opacity: 0.5, marginTop: '1rem' }}>Опубликовали</p>
                <div className={style.posted_by_cont}>
                    <Posters authors={[meta.author, ...meta.collaborators]} />
                </div>
            </div>
            <hr />
            <div className={link_style.link_cont}>
                <MDXRemote
                    source={contents}
                    components={{
                        Note,
                        Warn,
                        Tip,
                        a: NextAnchor,
                        Emote,
                        code: Code,
                        img: SImage,
                        video: SVideo
                    }}
                />
            </div>
        </main>
    );
};

export default Post;
