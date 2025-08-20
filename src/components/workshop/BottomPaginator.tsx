import { JSX } from 'react';
import { Paginator, PaginatorProps } from './Paginator';

export const BottomPaginator = (
    props: PaginatorProps & { elements: JSX.Element[] | null }
) => {
    if (props.elements === null) return;
    if (props.elements.length === 0) return;
    if (props.total_count < props.take) return;

    return <Paginator {...props} />;
};
