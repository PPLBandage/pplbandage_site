'use client';

import React, { CSSProperties, JSX, useState } from 'react';
import Style from '@/styles/tooltip.module.css';
import ReactCSSTransition from './CSSTransition';

export type StaticTooltipProps = {
    children: JSX.Element;
    title: string;
    disabled?: boolean;
    container_styles?: CSSProperties;
    tooltip_styles?: CSSProperties;
};

export const StaticTooltip = (props: StaticTooltipProps) => {
    const [displayed, setDisplayed] = useState<boolean>(false);

    if (props.disabled) return props.children;
    return (
        <div
            onMouseEnter={() => setDisplayed(true)}
            onMouseLeave={() => setDisplayed(false)}
            style={{ position: 'relative', ...props.container_styles }}
        >
            <ReactCSSTransition
                state={displayed}
                timeout={200}
                classNames={{
                    enter: Style.staticTooltipEnter,
                    exitActive: Style.staticTooltipEnter
                }}
            >
                <span className={Style.staticTooltip} style={props.tooltip_styles}>
                    {props.title}
                    <span className={Style.pointer} />
                </span>
            </ReactCSSTransition>
            {props.children}
        </div>
    );
};
