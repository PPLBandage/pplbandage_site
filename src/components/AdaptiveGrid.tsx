'use client';

import { JSX, useEffect, useState } from 'react';
import style from '@/styles/editor/page.module.css';
import style_workshop from '@/styles/workshop/page.module.css';

interface AdaptiveGridProps {
    child_width: number;
    children: JSX.Element[];
    header?: JSX.Element;
    className?: { readonly [key: string]: string };
}

const AdaptiveGrid = ({
    child_width,
    children,
    header,
    className
}: AdaptiveGridProps) => {
    const [columns, setColumns] = useState<JSX.Element[]>([]);
    const [columnCount, setColumnCount] = useState<number>(0);

    useEffect(() => {
        const resizeObserver = new ResizeObserver(entries => {
            const { width } = entries[0].contentRect;
            setColumnCount(Math.max(1, Math.floor(width / (child_width + 15))));
        });
        resizeObserver.observe(
            document.getElementById('layout_parent') as HTMLDivElement
        );
    }, []);

    useEffect(() => {
        if (!children) return;
        let result_arr = [];
        for (let i = 1; i < columnCount + 1; i++) {
            const _children = children.filter(
                (_, index) => (index + 1 - i) % columnCount === 0
            );
            const column = (
                <div
                    key={i}
                    style={{ width: child_width }}
                    className={className?.adaptive_grid_column}
                >
                    {_children}
                </div>
            );
            result_arr.push(column);
        }
        result_arr = result_arr.concat(
            new Array(columnCount - result_arr.length).fill(0)
        );
        setColumns(result_arr);
    }, [children, columnCount]);

    return (
        <>
            {!!header && (
                <div
                    style={{
                        width: '100%',
                        display: 'flex',
                        justifyContent:
                            children?.length >= columnCount
                                ? 'center'
                                : 'flex-start'
                    }}
                >
                    {header}
                </div>
            )}
            <div
                id="layout_parent"
                style={{
                    width: '100%',
                    display: 'flex',
                    columnGap: '1rem',
                    justifyContent: 'center',
                    flexDirection: 'row'
                }}
                className={`${style.adaptive_grid_parent} ${className?.adaptive_grid_parent}`}
            >
                {columns}
            </div>
        </>
    );
};

export default AdaptiveGrid;

export const SimpleGrid = ({
    children
}: {
    children: JSX.Element | JSX.Element[];
}) => {
    return (
        <div className={style_workshop.grid_container}>
            <div className={style_workshop.grid}>{children}</div>
        </div>
    );
};
