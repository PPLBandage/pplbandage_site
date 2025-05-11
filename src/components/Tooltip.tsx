'use client';

import React, { JSX, LegacyRef, useEffect, useRef, useState } from 'react';
import Style from '@/styles/tooltip.module.css';
import ReactCSSTransition from './CSSTransition';

interface TooltipProps {
    body: JSX.Element;
    children: JSX.Element;
    timeout?: number;
    className?: string;
    parent_id?: string;
    opacity?: string;
}

export const Tooltip = ({
    body,
    children,
    timeout = 800,
    className,
    parent_id,
    opacity = '.9'
}: TooltipProps) => {
    const [showTooltip, setShowTooltip] = useState<boolean>(false);
    const [position, setPosition] = useState<{ x: number; y: number }>({
        x: 0,
        y: 0
    });
    const [mf, setmf] = useState<boolean>(false);
    const [time, setTime] = useState<number>(0);
    const bodyRef = useRef<HTMLDivElement>(null);
    const [bodyDimensions, setBodyDimensions] = useState<{
        width: number;
        height: number;
    }>({ width: 0, height: 0 });

    const handleMouseEnter = () => {
        setmf(true);
        setTime(
            window.setTimeout(() => {
                setShowTooltip(true);
            }, timeout)
        );
    };

    const handleMouseLeave = () => {
        setmf(false);
        setShowTooltip(false);
        clearTimeout(time);
    };

    const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
        const x = e.clientX;
        let position_y = e.clientY;
        const windWidth = window.innerWidth;
        let position_x = Math.min(windWidth - bodyDimensions.width - 12, x);
        if (parent_id) {
            const el = document.getElementById(parent_id);
            const rect = el.getBoundingClientRect();
            position_x -= rect.x;
            position_y -= rect.y;
        }
        setPosition({ x: position_x, y: position_y });
    };

    useEffect(() => {
        if (showTooltip && bodyRef.current) {
            const { clientWidth, clientHeight } = bodyRef.current;
            setBodyDimensions({ width: clientWidth, height: clientHeight });
        }
    }, [showTooltip]);

    return (
        <div
            onMouseEnter={handleMouseEnter}
            onMouseLeave={handleMouseLeave}
            onMouseMove={handleMouseMove}
            className={className}
        >
            {children}
            {showTooltip && mf && (
                <div
                    className={Style.tooltipStyle}
                    id="tooltip"
                    style={{
                        left: position.x + 10 + 'px',
                        top: position.y + 10 + 'px',
                        opacity: opacity
                    }}
                    ref={bodyRef as LegacyRef<HTMLDivElement>}
                >
                    {body}
                </div>
            )}
        </div>
    );
};

interface GlobalTooltipProps {
    text: string;
    children: JSX.Element;
    className?: string;
    opacity?: string;
    timeout?: number;
}

export const UseGlobalTooltip = ({
    text,
    children,
    className,
    opacity = '.9',
    timeout
}: GlobalTooltipProps) => {
    const timeoutId = useRef<NodeJS.Timeout>(null);

    const handleMouseEnter = (e: React.MouseEvent<HTMLDivElement>) => {
        if (timeoutId.current) return;
        timeoutId.current = setTimeout(() => {
            const element =
                document.getElementById('global_tooltip') ??
                document.createElement('span');
            element.id = 'global_tooltip';
            element.innerText = text;
            element.className = `${Style.tooltipStyle} ${Style.globalTooltipStyle}`;
            document.body.insertBefore(element, document.body.firstChild);
            handleMouseMove(e);
        }, timeout);
    };

    const handleMouseLeave = () => {
        clearTimeout(timeoutId.current);
        timeoutId.current = null;
        const tooltip = document.getElementById('global_tooltip');
        if (tooltip) document.body.removeChild(tooltip);
    };

    const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
        let position_x = e.clientX + 10;
        let position_y = e.clientY + 10;
        const client_width = document.documentElement.clientWidth;
        const client_height = document.documentElement.clientHeight;
        const tooltip = document.getElementById('global_tooltip');

        if (!tooltip) {
            return;
        }

        const tooltip_rect = tooltip.getBoundingClientRect();
        tooltip.className = `${Style.tooltipStyle} ${Style.globalTooltipStyle}`;

        if (position_y > client_height - tooltip_rect.height) {
            position_x = e.clientX + 5;
            position_y = e.clientY - tooltip_rect.height - 5;
            tooltip.className = `${tooltip.className} ${Style.upperTooltipStyle}`;
        }

        if (position_x > client_width - (tooltip_rect.width + 20)) {
            position_x = e.clientX - tooltip_rect.width;
            tooltip.className = `${tooltip.className} ${Style.leftTooltipStyle}`;
        }

        tooltip.style.left = position_x.toString() + 'px';
        tooltip.style.top = position_y.toString() + 'px';
        tooltip.style.opacity = opacity;
    };

    return (
        <div
            onMouseEnter={handleMouseEnter}
            onMouseLeave={handleMouseLeave}
            onMouseMove={handleMouseMove}
            className={className}
        >
            {children}
        </div>
    );
};

type StaticTooltipProps = {
    children: JSX.Element;
    title: string;
};

export const StaticTooltip = (props: StaticTooltipProps) => {
    const [displayed, setDisplayed] = useState<boolean>(false);
    return (
        <div
            onMouseEnter={() => setDisplayed(true)}
            onMouseLeave={() => setDisplayed(false)}
            style={{ position: 'relative' }}
        >
            <ReactCSSTransition
                state={displayed}
                timeout={200}
                classNames={{
                    enter: Style.staticTooltipEnter,
                    exitActive: Style.staticTooltipEnter
                }}
            >
                <span className={Style.staticTooltip}>
                    {props.title}
                    <span className={Style.pointer} />
                </span>
            </ReactCSSTransition>
            {props.children}
        </div>
    );
};
