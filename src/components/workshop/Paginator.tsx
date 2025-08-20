'use client';

import React, { JSX, useEffect, useState } from 'react';
import Styles from '@/styles/paginator.module.css';
import { IconChevronRight, IconChevronLeft } from '@tabler/icons-react';

export interface PaginatorProps {
    total_count: number;
    take: number;
    onChange(page: number): void;
    page: number;
}

// Андрей, если ты из будущего и читаешь это,
// Прости меня, мне лень это переписывать

// UPD 17.08.25: Я тебя не прощу, но переписывать я не буду
export const Paginator = ({ total_count, take, onChange, page }: PaginatorProps) => {
    const [_page, _setPage] = useState<number>(page);
    const [_pages, _setPages] = useState<JSX.Element[]>([]);

    const [_totalCount, _setTotalCount] = useState<number>(total_count);
    const [_take, _setTake] = useState<number>(take);
    const [_display, _setDisplay] = useState<boolean>(false);

    useEffect(() => {
        _setTotalCount(total_count);
        _setTake(take);
        const pages_count = Math.ceil(total_count / take);
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
        const iterable_page =
            _page > 2 && pages_count > 4 ? Math.min(_page - 2, pages_count - 5) : 0;

        for (let x = iterable_page; x < 5 + iterable_page; x++) {
            if (x >= pages_count && pages_count < 5) continue;
            data.push(
                <p
                    key={x}
                    className={
                        `${Styles.page} ` +
                        `${x == Math.max(0, _page) && Styles.active}`
                    }
                    onClick={() => updatePage(x)}
                >
                    {x + 1}
                </p>
            );
        }
        _setPages(data);
    }, [_page, _totalCount, _take]);

    const updatePage = (_page: number) => {
        _setPage(_page);

        const pages_count = Math.ceil(_totalCount / _take);
        const page = Math.min(Math.max(0, _page), Math.max(0, pages_count - 1));
        onChange(page);
    };

    const loadingPages = Array.from({ length: 5 }, (_, index) => (
        <p key={index} className={`${Styles.page} ${Styles.page_loading}`} />
    ));

    return (
        <div className={Styles.outer}>
            <div className={Styles.container}>
                <IconChevronLeft
                    className={`${Styles.page} ${Styles.arrow_left}`}
                    onClick={() => updatePage(Math.max(0, _page - 1))}
                />
                {_display ? _pages : loadingPages}
                <IconChevronRight
                    className={`${Styles.page} ${Styles.arrow_right}`}
                    onClick={() =>
                        updatePage(
                            Math.min(_page + 1, Math.ceil(_totalCount / _take) - 1)
                        )
                    }
                />
            </div>
        </div>
    );
};
