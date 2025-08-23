'use client';

import { JSX, useEffect, useRef, useState } from 'react';
import { CustomLink } from './Search';
import { StaticTooltip } from '../Tooltip';

export const TextFormatter = ({ text }: { text: string }) => {
    const linkRegex = /https?:\/\/[^\s]+/g;

    const parts = text.split(linkRegex);
    const links = text.match(linkRegex) || [];

    let jsx: JSX.Element[] = [];
    parts.forEach((part, index) => {
        jsx = jsx.concat(processEmotes(part));

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

const processEmotes = (input: string) => {
    const parts = input.split(/(:[a-zA-Z0-9_+-]+:)/g);
    const result: JSX.Element[] = [];
    let key_i = 0;

    for (const part of parts) {
        if (part.startsWith(':') && part.endsWith(':')) {
            const name = part.replaceAll(':', '').toLowerCase();

            result.push(<Emote key={`emoji-${key_i}`} name={name} />);
        } else {
            result.push(<span key={key_i}>{part}</span>);
        }
        key_i++;
    }

    return result;
};

export const Emote = ({ name, height }: { name: string; height?: string }) => {
    const [failed, setFailed] = useState<boolean>(false);
    const imageRef = useRef<HTMLImageElement>(null);

    useEffect(() => {
        if (!imageRef.current) return;

        // Знаете почему рефами? А потому что через обычный src проп браузер
        // не вызывает onError ивент. Почему? Ха! Спросите чего попроще
        imageRef.current.src = `/static/emotes/${name}.png`;
    }, []);

    if (failed) return <>:{name}:</>;

    return (
        <StaticTooltip
            title={`:${name}:`}
            container_styles={{ display: 'inline' }}
            tooltip_styles={{ minWidth: 'max-content' }}
            use_span
        >
            <img
                ref={imageRef}
                alt={`:${name}:`}
                onError={() => setFailed(true)}
                style={{
                    width: 'auto',
                    height: height || '1em',
                    verticalAlign: 'middle'
                }}
            />
        </StaticTooltip>
    );
};

export const removeLink = (text: string) => {
    const linkRegex = /https?:\/\/[^\s]+/g;
    return processEmotes(text?.replaceAll(linkRegex, '<link>'));
};
