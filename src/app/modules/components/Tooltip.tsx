"use client";

import React, { LegacyRef, useEffect, useRef, useState } from 'react';
import Style from "@/app/styles/tooltip.module.css";

interface TooltipProps {
    body: JSX.Element,
    children: JSX.Element,
    timeout?: number,
    className?: string,
    parent_id?: string,
    opacity?: string
}

export const Tooltip = ({ body, children, timeout = 800, className, parent_id, opacity = ".9" }: TooltipProps) => {
    const [showTooltip, setShowTooltip] = useState<boolean>(false);
    const [position, setPosition] = useState<{ x: number, y: number }>({ x: 0, y: 0 });
    const [mf, setmf] = useState<boolean>(false);
    const [time, setTime] = useState<number>(0);
    const bodyRef = useRef<HTMLDivElement>();
    const [bodyDimensions, setBodyDimensions] = useState<{ width: number, height: number }>({ width: 0, height: 0 });


    const handleMouseEnter = () => {
        setmf(true);
        setTime(window.setTimeout(() => { setShowTooltip(true) }, timeout));
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
            position_y -= rect.y
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
            {(showTooltip && mf) && (
                <div className={Style.tooltipStyle} id="tooltip" style={{ left: position.x + 10 + 'px', top: position.y + 10 + 'px', opacity: opacity }} ref={bodyRef as LegacyRef<HTMLDivElement>}>
                    {body}
                </div>
            )
            }
        </div>
    );
};


interface GlobalTooltipProps {
    text: string,
    children: JSX.Element,
    className?: string,
    opacity?: string
}

export const UseGlobalTooltip = ({ text, children, className, opacity = ".9" }: GlobalTooltipProps) => {
    const handleMouseEnter = () => {
        const element = document.getElementById('global_tooltip') ?? document.createElement('span');
        element.id = 'global_tooltip';
        element.innerText = text;
        element.className = `${Style.tooltipStyle} ${Style.globalTooltipStyle}`;
        document.body.insertBefore(element, document.body.firstChild);
    };

    const handleMouseLeave = () => {
        const tooltip = document.getElementById('global_tooltip');
        tooltip && document.body.removeChild(tooltip);
    };

    const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
        const position_x = e.clientX + 10;
        const position_y = e.clientY + 10;

        const tooltip = document.getElementById('global_tooltip');
        if (tooltip) {
            tooltip.style.left = position_x.toString() + 'px';
            tooltip.style.top = position_y.toString() + 'px';
            tooltip.style.opacity = opacity;
        }
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
}
