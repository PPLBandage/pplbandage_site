import { LayoutContent } from '@/types/blog';
import sanitizeHtml from 'sanitize-html';

export const REPO_PATH = process.env.BLOG_REPO_PATH;
const allowedTags = [
    'p',
    'b',
    'i',
    'u',
    'a',
    'video',
    'img',
    'Note',
    'Warn',
    'Tip',
    'Emote',
    'br'
];

const commonProps = ['key', 'children'];
const allowedProps: { [key: string]: string[] } = {
    a: ['href', 'target'].concat(commonProps),
    img: ['src'].concat(commonProps),
    video: ['src', 'type', 'width'].concat(commonProps),
    Emote: ['name'].concat(commonProps)
};

export const getLayoutContents = async (): Promise<{
    [key: string]: LayoutContent;
}> => {
    const res = await fetch(
        `https://raw.githubusercontent.com/${REPO_PATH}/main/index.json`,
        {
            cache: 'force-cache',
            next: { revalidate: 300 },
            headers: { authorization: `Bearer ${process.env.GITHUB_TOKEN}` },
            signal: AbortSignal.timeout(5000)
        }
    );

    if (!res.ok) throw new Error('Cannot fetch blog layout from GitHub!');
    return await res.json();
};

export const getMdContents = async (page: string): Promise<string> => {
    const page_response = await fetch(
        `https://raw.githubusercontent.com/${REPO_PATH}/main/pages/${page}/page.md`,
        {
            cache: 'force-cache',
            next: { revalidate: 300 },
            headers: { authorization: `Bearer ${process.env.GITHUB_TOKEN}` },
            signal: AbortSignal.timeout(5000)
        }
    );

    if (!page_response.ok) throw new Error('Cannot fetch page contents!');

    let markdown = await page_response.text();
    markdown = markdown.replaceAll(
        '/images',
        `https://raw.githubusercontent.com/${REPO_PATH}/main/images`
    );

    const cleanString = sanitizeHtml(markdown, {
        allowedTags: allowedTags,
        allowedAttributes: allowedProps,
        parser: {
            lowerCaseTags: false
        }
    });

    return cleanString;
};
