"use client";

import React, { Dispatch, useEffect, useState } from 'react';
import Select, { ActionMeta, GroupBase, PropsValue, SingleValue } from 'react-select';
import Styles from "../styles/search.module.css"
import Image from 'next/image';

const options: readonly {value: number, label: String}[] = [
    { value: 10, label: "10"},
    { value: 20, label: "20"},
    { value: 30, label: "30"},
    { value: 50, label: "50"},
];

const options_sortir: readonly {value: string, label: String}[] = [
    { value: 'date_up', label: "По дате создания"}
];

interface SearchProps {
    onSearch(search: string): void,
    onChangeTake(take: number): void
}

export const Search = ({onSearch, onChangeTake}: SearchProps) => {
    const [search, setSearch] = useState<string>("");
    return (
        <div className={Styles.parent}>
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
                    <p className={Styles.take}>Отображать на страние:</p>
                    <Select
                        options={options}
                        className={`react-select-container ${Styles.select_take}`}
                        classNamePrefix="react-select"
                        defaultValue={options[0]}
                        onChange={(n, a) => onChangeTake(n.value)}
                    />
                </div>

                <div style={{display: "flex", alignItems: "center", flexWrap: "wrap"}}>
                    <p className={Styles.take}>Сортировать:</p>
                    <Select
                        options={options_sortir}
                        className={`react-select-container ${Styles.select_sortir}`}
                        classNamePrefix="react-select"
                        defaultValue={options_sortir[0]}
                    />
                </div>
            </div>
        </div>
    );
};
