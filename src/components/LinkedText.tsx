import { JSX } from 'react';
import { CustomLink } from './Search';

export const LinkedText = ({ text }: { text: string }) => {
    const linkRegex = /https?:\/\/[^\s]+/g;

    const parts = text.split(linkRegex);
    const links = text.match(linkRegex) || [];

    const jsx: JSX.Element[] = [];
    parts.forEach((part, index) => {
        jsx.push(<span key={`sample_${index}`}>{part}</span>);
        if (index < links.length) {
            const link = links[index];
            jsx.push(
                <CustomLink key={index} href={link} target="_blank">
                    {link}
                </CustomLink>
            );
        }
    });

    return <span>{jsx}</span>;
};

export const removeLink = (text: string) => {
    const linkRegex = /https?:\/\/[^\s]+/g;
    return text?.replaceAll(linkRegex, '<link>');
};
