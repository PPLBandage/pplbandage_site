import { allowedProps, allowedTags } from './components/sanitizer';
import { LayoutContent } from './types';
import sanitizeHtml from 'sanitize-html';

export const REPO_OWNER = 'PPLBandage';
export const REPO_NAME = 'pages';

export const getLayoutContents = async (): Promise<LayoutContent[]> => {
    const res = await fetch(
        `https://api.github.com/repos/${REPO_OWNER}/${REPO_NAME}/contents`,
        {
            cache: 'force-cache',
            next: { revalidate: 300 },
            headers: { authorization: `Bearer ${process.env.GITHUB_TOKEN}` }
        }
    );

    if (!res.ok) throw new Error('Cannot fetch tutorials layout from GitHub!');

    const files = await res.json();
    const layout = files.find((file: any) => file.name === 'layout.json');

    if (!layout) throw new Error('Cannot find pages layout');

    const layout_response = await fetch(layout.download_url, {
        cache: 'force-cache',
        next: { revalidate: 300 },
        headers: { authorization: `Bearer ${process.env.GITHUB_TOKEN}` }
    });

    if (!layout_response.ok) {
        throw new Error('Cannot fetch layout contents!');
    }

    return await layout_response.json();
};

export const getMdContents = async (path: string): Promise<string> => {
    const page_response = await fetch(
        `https://raw.githubusercontent.com/${REPO_OWNER}/${REPO_NAME}/main${path}`,
        {
            cache: 'no-cache',
            next: { revalidate: 300 },
            headers: { authorization: `Bearer ${process.env.GITHUB_TOKEN}` }
        }
    );

    if (!page_response.ok) throw new Error('Cannot fetch page contents!');
    const markdown = (await page_response.text()).replace(
        '/images',
        'https://raw.githubusercontent.com/PPLBandage/pages/main/images'
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
