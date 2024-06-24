"use client";

import React, { Dispatch, useEffect, useState } from 'react';
import Select from 'react-select';
import { CSSTransition } from 'react-transition-group';
import Styles from "../styles/search.module.css"
import Image from 'next/image';
import { Category } from '../interfaces';
import { CategoryEl } from './card.module';

const options: readonly {value: number, label: String}[] = [
    { value: 12, label: "12"},
    { value: 24, label: "24"},
    { value: 36, label: "36"},
    { value: 48, label: "48"},
];

const options_sortir: readonly {value: string, label: String}[] = [
    { value: 'popular_up', label: "По популярности"},
    { value: 'date_up', label: "По дате создания"},
    { value: 'name_up', label: "По имени"}
];

interface SearchProps {
    onSearch(search: string): void,
    onChangeTake(take: number): void,
    onChangeSort(sort: string): void,
    onChangeFilters(categories: Category[]): void,
    categories: Category[]
}

export const Search = ({onSearch, onChangeTake, onChangeFilters, onChangeSort, categories}: SearchProps) => {
    const [search, setSearch] = useState<string>("");
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
                           onClick={() => {updateCategory(category.id, !category.enabled)}} 
                />
    });
            

    return (
            <div className={Styles.parent}>
                <div>
                    <div className={Styles.container}>
                        <div style={{display: "flex", alignItems: "center"}}>
                            <input 
                                onInput={(event) => setSearch((event.target as HTMLInputElement).value)}
                                onKeyUp={(e) => {
                                    if (e.code == "Enter"){
                                        onSearch(search)
                                    }
                                }}
                                className={Styles.search}
                                placeholder='Введите название/автора/id'
                            />
                            <div className={Styles.search_loop} onClick={() => onSearch(search)}>
                                <Image className={Styles.search_loop_icon} src="/static/icons/search.svg" alt="search" width={25} height={25}/>
                            </div>
                        </div>

                        <div style={{display: "flex", alignItems: "center", flexWrap: "wrap"}}>
                            <p className={Styles.take}>Сортировать</p>
                            <Select
                                options={options_sortir}
                                className={`react-select-container ${Styles.select_sortir}`}
                                classNamePrefix="react-select"
                                defaultValue={options_sortir[0]}
                                onChange={(n, a) => onChangeSort(n.value)}
                            />
                        </div>

                        <div style={{display: "flex", alignItems: "center", flexWrap: "wrap"}}>
                            <p className={Styles.take}>Отображать на странице</p>
                            <Select
                                options={options}
                                className={`react-select-container ${Styles.select_take}`}
                                classNamePrefix="react-select"
                                defaultValue={options[0]}
                                onChange={(n, a) => onChangeTake(n.value)}
                            />
                        </div>

                        <div style={{display: "flex", alignItems: "center", flexWrap: "wrap"}}
                            className={Styles.filter_div}
                            onClick={() => setExpanded(prev => !prev)}>
                            <Image src="/static/icons/filter.svg" alt="filter" width={24} height={24} />
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
                                {categories_el}
                            </div>
                    </CSSTransition>
                </div>
                </div>
            </div>
    );
};
