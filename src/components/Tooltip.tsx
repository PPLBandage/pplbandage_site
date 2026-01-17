'use client';

import { CSSProperties, JSX, useState } from 'react';
import Style from '@/styles/tooltip.module.css';
import ReactCSSTransition from './CSSTransition';

export type StaticTooltipProps = {
    children: JSX.Element;
    title: string | JSX.Element | JSX.Element[];
    use_span?: boolean;
    disabled?: boolean;
    container_styles?: CSSProperties;
    tooltip_styles?: CSSProperties;

    styles?: Record<string, string>;
};

export const StaticTooltip = (props: StaticTooltipProps) => {
    const [displayed, setDisplayed] = useState<boolean>(false);

    if (props.disabled) return props.children;

    const Cont = props.use_span ? 'span' : 'div';
    return (
        <Cont
            onMouseEnter={() => setDisplayed(true)}
            onMouseLeave={() => setDisplayed(false)}
            style={{ position: 'relative', ...props.container_styles }}
            className={props.styles?.tooltip_container}
        >
            <ReactCSSTransition
                state={displayed}
                timeout={200}
                classNames={{
                    enter: Style.staticTooltipEnter,
                    exitActive: Style.staticTooltipEnter
                }}
            >
                <span
                    className={`${Style.staticTooltip} ${props.styles?.tooltip_tooltip}`}
                    style={props.tooltip_styles}
                >
                    {props.title}
                    <span className={Style.pointer} />
                </span>
            </ReactCSSTransition>
            {props.children}
        </Cont>
    );
};
