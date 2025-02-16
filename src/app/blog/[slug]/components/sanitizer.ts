import React from 'react';
import { JSX } from 'react';

export const allowedTags = [
    'p',
    'b',
    'i',
    'em',
    'strong',
    'a',
    'img',
    'Note',
    'Warn',
    'Tip',
    'Accent',
    'br'
];

const commonProps = ['key', 'children'];
export const allowedProps: { [key: string]: string[] } = {
    a: ['href', 'target'].concat(commonProps),
    img: ['src'].concat(commonProps)
};

const sanitizeProps = (
    props: { [key: string]: unknown } | undefined,
    type: string
) => {
    if (!props) {
        return {};
    }
    return Object.keys(props)
        .filter(key => (allowedProps[type] ?? commonProps).includes(key))
        .reduce((acc, key) => ({ ...acc, [key]: props[key] }), {});
};

export const sanitize = (content: JSX.Element): JSX.Element | string | null => {
    if (typeof content === 'string') {
        return content;
    }
    if (!allowedTags.includes(content.type as string)) {
        return null;
    }

    const children = content.props.children;

    if (!children) {
        return content;
    }

    if (typeof children === 'string') {
        return React.createElement(
            content.type,
            sanitizeProps(content.props, content.type),
            ...content.props.children
        );
    }

    if (Array.isArray(children)) {
        const sanitizedChildren = children
            .map(child => sanitize(child))
            .filter(res => res !== null);

        return React.createElement(
            content.type,
            sanitizeProps(content.props, content.type),
            sanitizedChildren
        );
    }
    return sanitize(children);
};
