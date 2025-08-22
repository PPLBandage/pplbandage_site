import { LayoutContent } from '@/types/blog';
import sanitizeHtml from 'sanitize-html';

export const REPO_PATH = process.env.BLOG_REPO_PATH;
const allowedTags = [
    'p',
    'b',
    'i',
    'u',
    'a',
    'img',
    'Note',
    'Warn',
    'Tip',
    'Accent',
    'br'
];

const commonProps = ['key', 'children'];
const allowedProps: { [key: string]: string[] } = {
    a: ['href', 'target'].concat(commonProps),
    img: ['src'].concat(commonProps)
};

export const getLayoutContents = async (): Promise<{
    [key: string]: LayoutContent;
}> => {
    const res = await fetch(
        `https://raw.githubusercontent.com/${REPO_PATH}/main/index.json`,
        {
            cache: 'force-cache',
            next: { revalidate: 300 },
            headers: { authorization: `Bearer ${process.env.GITHUB_TOKEN}` }
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
            headers: { authorization: `Bearer ${process.env.GITHUB_TOKEN}` }
        }
    );

    if (!page_response.ok) throw new Error('Cannot fetch page contents!');
    const markdown = (await page_response.text()).replace(
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
