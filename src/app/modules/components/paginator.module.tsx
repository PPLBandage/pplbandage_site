"use client";

import React, { useEffect, useState } from 'react';
import Styles from "@/app/styles/paginator.module.css";
import { IconChevronRight, IconChevronLeft } from '@tabler/icons-react'

interface PaginatorProps {
    total_count: number,
    take: number,
    onChange(page: number): void,
    page: number
}

export const Paginator = ({ total_count, take, onChange, page }: PaginatorProps) => {
    const [_page, _setPage] = useState<number>(0);
    const [_pages, _setPages] = useState<JSX.Element[]>([]);

    const [_totalCount, _setTotalCount] = useState<number>(total_count);
    const [_take, _setTake] = useState<number>(take);
    const [_display, _setDisplay] = useState<boolean>(true);


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
    }, [page])

    useEffect(() => {
        const pages_count = Math.ceil(_totalCount / _take);
        _setDisplay(pages_count != 0);
        let data: JSX.Element[] = [];
        let itpage = _page > 2 && pages_count > 4 ? _page - 2 : 0;
        for (let x = itpage; x < 5 + itpage; x++) {
            data.push(
                <p style={x == _page ? { backgroundColor: "var(--main-element-color)", padding: ".5rem" } : x < pages_count ? {} : { visibility: "hidden" }}
                    key={x}
                    className={Styles.page}
                    onClick={() => _setPage(x)}>
                    {x + 1}
                </p>
            );
        }
        _setPages(data);
        const page = Math.min(Math.max(0, _page), pages_count - 1);
        onChange(page);
    }, [_page, _totalCount, _take]);

    return _display ? <div className={Styles.container}>
        {_pages.length > 0 && <>
            <IconChevronLeft className={`${Styles.page} ${Styles.arrow}`} onClick={() => _setPage(last => Math.max(0, last - 1))} />
            {_pages}
            <IconChevronRight className={`${Styles.page} ${Styles.arrow}`} onClick={() => _setPage(last => Math.min(last + 1, Math.ceil(_totalCount / _take) - 1))} />
        </>
        }
    </div> : null;

};
