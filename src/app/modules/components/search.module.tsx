"use client";

import React, { useEffect, useState } from 'react';
import Select from 'react-select';
import { CSSTransition } from 'react-transition-group';
import Styles from "@/app/styles/search.module.css"
import { Category } from '@/app/interfaces';
import { CategoryEl } from './card.module';
import styleLink from '@/app/styles/tutorials/common.module.css';
import Link from 'next/link';
import style_workshop from "@/app/styles/workshop/page.module.css";
import { IconSearch, IconFilter } from '@tabler/icons-react';
import IconSvg from '@/app/resources/icon.svg';

const options_take: readonly { value: number, label: string }[] = [
    { value: 12, label: "12" },
    { value: 24, label: "24" },
    { value: 36, label: "36" },
    { value: 48, label: "48" },
];

const options_sortir: readonly { value: string, label: string }[] = [
    { value: 'relevant_up', label: 'По релевантности' },
    { value: 'popular_up', label: 'По популярности' },
    { value: 'date_up', label: 'По дате создания' },
    { value: 'name_up', label: 'По имени' }
];

interface SearchProps {
    onSearch(search: string): void,
    onChangeTake(take: number): void,
    onChangeSort(sort: string): void,
    onChangeFilters(categories: Category[]): void,
    sort: string,
    take: number,
    search: string,
    categories: Category[]
}

export const Search = ({
    onSearch,
    onChangeTake,
    onChangeFilters,
    onChangeSort,
    categories,
    sort,
    take,
    search
}: SearchProps) => {
    const [_search, _setSearch] = useState<string>(search ?? '');
    const [expanded, setExpanded] = useState<boolean>(false);
    const [_categories, _setCategories] = useState<Category[]>([]);

    const updateCategory = (id: number, enabled: boolean) => {
        _setCategories((prevCategories) =>
            prevCategories.map((category) =>
                category.id === id ? { ...category, enabled: enabled } : category
            )
        );
    };

    useEffect(() => {
        _setCategories(categories);
    }, [categories]);

    useEffect(() => {
        onChangeFilters(_categories);
    }, [_categories]);

    const categories_el = _categories.map((category) => {
        return <CategoryEl key={category.id}
            category={category}
            enabled={category.enabled}
            hoverable={true}
            onClick={() => { updateCategory(category.id, !category.enabled) }}
        />
    });

    return (
        <div className={Styles.parent}>
            <div>
                <div className={Styles.container}>
                    <div style={{ display: "flex", alignItems: "center" }}>
                        <input
                            onChange={(event) => _setSearch(event.target.value)}
                            onKeyUp={(e) => {
                                if (e.code == "Enter" || e.code == "NumpadEnter") {
                                    onSearch(_search)
                                }
                            }}
                            className={Styles.search}
                            placeholder='Введите название/автора/id'
                            defaultValue={search}
                        />
                        <div className={Styles.search_loop} onClick={() => onSearch(_search)}>
                            <IconSearch className={Styles.search_loop_icon} width={25} height={25} />
                        </div>
                    </div>

                    <div style={{ display: "flex", alignItems: "center", flexWrap: "wrap" }}>
                        <p className={Styles.take}>Сортировать</p>
                        <Select
                            options={options_sortir}
                            className={`react-select-container ${Styles.select_sortir}`}
                            classNamePrefix="react-select"
                            onChange={(n, _) => onChangeSort(n.value)}
                            value={options_sortir.find(i => i.value === sort)}
                            isSearchable={false}
                        />
                    </div>

                    <div style={{ display: "flex", alignItems: "center", flexWrap: "wrap" }}>
                        <p className={Styles.take}>Отображать на странице</p>
                        <Select
                            options={options_take}
                            className={`react-select-container ${Styles.select_take}`}
                            classNamePrefix="react-select"
                            isSearchable={false}
                            onChange={(n, _) => onChangeTake(n.value)}
                            value={options_take.find(i => i.value === take)}
                        />
                    </div>

                    <div style={{ display: "flex", alignItems: "center", flexWrap: "wrap" }}
                        className={Styles.filter_div}
                        onClick={() => setExpanded(prev => !prev)}>
                        <IconFilter width={24} height={24} />
                        <p className={Styles.filter}>Фильтры</p>
                    </div>
                </div>
                <div className={Styles.category_menu_parent}>
                    <CSSTransition
                        in={expanded}
                        timeout={150}
                        classNames={{
                            enter: Styles['menu-enter'],
                            enterActive: Styles['menu-enter-active'],
                            exit: Styles['menu-exit'],
                            exitActive: Styles['menu-exit-active'],
                        }}
                        unmountOnExit>
                        <div className={Styles.category_menu}>
                            {categories.length > 0 ? categories_el : <IconSvg width={86} height={86} className={style_workshop.loading} />}
                        </div>
                    </CSSTransition>
                </div>
            </div>
        </div>
    );
};

export const CustomLink = ({ children, href }: { children: JSX.Element | string, href: string }) => {
    return (
        <Link className={styleLink.CustomLink} href={href}>{children}</Link>
    );
}
