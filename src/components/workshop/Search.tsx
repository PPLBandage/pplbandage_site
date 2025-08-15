'use client';

import React, { HTMLAttributeAnchorTarget, JSX, useState } from 'react';
import Select from 'react-select';
import Styles from '@/styles/search.module.css';
import styleLink from '@/styles/tutorials/common.module.css';
import Link from 'next/link';
import { IconSearch } from '@tabler/icons-react';

const options_take: readonly { value: number; label: string }[] = [
    { value: 12, label: '12' },
    { value: 24, label: '24' },
    { value: 36, label: '36' },
    { value: 48, label: '48' },
    { value: 60, label: '60' }
];

const options_sortir: readonly { value: string; label: string }[] = [
    { value: 'relevant_up', label: 'По релевантности' },
    { value: 'popular_up', label: 'По популярности' },
    { value: 'date_up', label: 'По дате создания' },
    { value: 'name_up', label: 'По имени' }
];

interface SearchProps {
    onSearch(search: string): void;
    onChangeTake(take: number): void;
    onChangeSort(sort: string): void;
    sort: string;
    take: number;
    search: string;
}

export const Search = ({
    onSearch,
    onChangeTake,
    onChangeSort,
    sort,
    take,
    search
}: SearchProps) => {
    const [_search, _setSearch] = useState<string>(search ?? '');

    return (
        <div className={Styles.parent}>
            <div>
                <div className={Styles.container}>
                    <div className={Styles.search_parent}>
                        <input
                            onChange={event => _setSearch(event.target.value)}
                            onKeyUp={e => {
                                if (e.code == 'Enter' || e.code == 'NumpadEnter') {
                                    onSearch(_search);
                                }
                            }}
                            className={Styles.search}
                            placeholder="Введите название/автора/id"
                            defaultValue={search}
                        />
                        <div
                            className={Styles.search_loop}
                            onClick={() => onSearch(_search)}
                        >
                            <IconSearch
                                className={Styles.search_loop_icon}
                                width={25}
                                height={25}
                            />
                        </div>
                    </div>

                    <div className={Styles.components_container}>
                        <p className={Styles.take}>Сортировать</p>
                        <Select
                            options={options_sortir}
                            className={`react-select-container ${Styles.select_sortir}`}
                            classNamePrefix="react-select"
                            onChange={n => onChangeSort(n!.value)}
                            value={options_sortir.find(i => i.value === sort)}
                            isSearchable={false}
                            instanceId="select-1"
                        />
                    </div>

                    <div className={Styles.components_container}>
                        <p className={Styles.take}>Отображать на странице</p>
                        <Select
                            options={options_take}
                            className={`react-select-container ${Styles.select_take}`}
                            classNamePrefix="react-select"
                            isSearchable={false}
                            onChange={n => onChangeTake(n!.value)}
                            value={options_take.find(i => i.value === take)}
                            instanceId="select-2"
                        />
                    </div>
                </div>
            </div>
        </div>
    );
};

export const CustomLink = ({
    children,
    href,
    target
}: {
    children: JSX.Element | string;
    href: string;
    target?: HTMLAttributeAnchorTarget;
}) => {
    return (
        <Link className={styleLink.CustomLink} href={href} target={target}>
            {children}
        </Link>
    );
};
