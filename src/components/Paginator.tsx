'use client';

import React, { JSX, useEffect, useState } from 'react';
import Styles from '@/styles/paginator.module.css';
import { IconChevronRight, IconChevronLeft } from '@tabler/icons-react';

interface PaginatorProps {
    total_count: number;
    take: number;
    onChange(page: number): void;
    page: number;
}

export const Paginator = ({
    total_count,
    take,
    onChange,
    page
}: PaginatorProps) => {
    const [_page, _setPage] = useState<number>(page);
    const [_pages, _setPages] = useState<JSX.Element[]>([]);

    const [_totalCount, _setTotalCount] = useState<number>(total_count);
    const [_take, _setTake] = useState<number>(take);
    const [_display, _setDisplay] = useState<boolean>(false);

    useEffect(() => {
        _setTotalCount(total_count);
        _setTake(take);
        const pages_count = Math.ceil(total_count / take);
        _setDisplay(pages_count != 0);
        if (_page + 2 > pages_count && pages_count != 0) {
            const page = Math.min(Math.max(0, _page - 1), pages_count - 1);
            _setPage(page);
            onChange(page);
        }
    }, [total_count, take]);

    useEffect(() => {
        _setPage(page);
    }, [page]);

    useEffect(() => {
        const pages_count = Math.ceil(_totalCount / _take);
        _setDisplay(pages_count != 0);
        const data: JSX.Element[] = [];
        const iterable_page = _page > 2 && pages_count > 4 ? _page - 2 : 0;
        for (let x = iterable_page; x < 5 + iterable_page; x++) {
            data.push(
                <p
                    style={
                        x == Math.max(0, _page)
                            ? {
                                  backgroundColor: 'var(--main-element-color)',
                                  padding: '.5rem'
                              }
                            : x < pages_count
                            ? {}
                            : { visibility: 'hidden' }
                    }
                    key={x}
                    className={Styles.page}
                    onClick={() => _setPage(x)}
                >
                    {x + 1}
                </p>
            );
        }
        _setPages(data);
        const page = Math.min(Math.max(0, _page), Math.max(0, pages_count - 1));
        onChange(page);
    }, [_page, _totalCount, _take]);

    const loadingPages = Array.from({ length: 5 }, (_, index) => (
        <p key={index} className={`${Styles.page} ${Styles.page_loading}`} />
    ));

    return (
        <div className={Styles.container}>
            <>
                <IconChevronLeft
                    className={`${Styles.page} ${Styles.arrow}`}
                    onClick={() => _setPage(last => Math.max(0, last - 1))}
                />
                {_display ? _pages : loadingPages}
                <IconChevronRight
                    className={`${Styles.page} ${Styles.arrow}`}
                    onClick={() =>
                        _setPage(last =>
                            Math.min(
                                last + 1,
                                Math.ceil(_totalCount / _take) - 1
                            )
                        )
                    }
                />
            </>
        </div>
    );
};
