"use client";

import { useEffect, useState } from "react";

interface AdaptiveGridProps {
    child_width: number,
    children: JSX.Element[]
}

const AdaptiveGrid = ({ child_width, children }: AdaptiveGridProps) => {
    const [columns, setColumns] = useState<JSX.Element[]>([]);
    const [columnCount, setColumnCount] = useState<number>(0);

    useEffect(() => {
        const resizeObserver = new ResizeObserver(entries => {
            const { width } = entries[0].contentRect;
            setColumnCount(Math.max(1, Math.floor(width / (child_width + 15))));
        });
        resizeObserver.observe(document.getElementById('layout_parent') as HTMLDivElement);
    }, [])

    useEffect(() => {
        if (!children) return;
        const result_arr = [];
        for (let i = 1; i < columnCount + 1; i++) {
            const _children = children.filter((_, index) => (index + 1 - i) % columnCount === 0);
            const column = <div>{_children}</div>;
            result_arr.push(column);
        }
        setColumns(result_arr);
    }, [children, columnCount])

    return (
        <div id='layout_parent' style={{ width: '100%', display: 'flex', columnGap: '15px', justifyContent: children?.length >= columnCount ? 'center' : 'flex-start' }}>
            {columns}
        </div>
    );
}

export default AdaptiveGrid;