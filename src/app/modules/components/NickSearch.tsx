import Select, { GroupBase } from 'react-select';
import * as Interfaces from "@/app/interfaces";
import { useState } from 'react';
import Style from "@/app/styles/nick_search.module.css";
import ApiManager from '../utils/apiManager';

export interface SearchResponse {
    status: string;
    requestedFragment: string;
    data: {
        name: string;
        uuid: string;
        head: string;
    }[];
    total_count: number;
    next_page: number;
}

interface SearchProps {
    onChange(value: string): void
}

const Searcher = ({ onChange }: SearchProps) => {
    const [loading, setLoading] = useState<boolean>(false);
    const [input, setInput] = useState<string>("");
    const [nicknames, setNicknames] = useState<(Interfaces.Option | GroupBase<Interfaces.Option>)[]>([{
        value: "no_data",
        label: <>Введите никнейм</>,
        isDisabled: true
    }]);
    const [nickValue, setNickValue] = useState<Interfaces.Option>({ value: "no_data", label: <>Введите никнейм</> });

    const fetch_nicknames = (nickname: string) => {
        nickname = nickname.replaceAll("-", "").replace(/[^a-z_0-9\s]/gi, '');
        if (nickname.length >= 32) {
            nickname = nickname.slice(0, 32);
        }
        setInput(nickname);
        if (nickname.length === 0) {
            setNicknames([{ value: "no_data", label: <>Введите никнейм</>, isDisabled: true }]);
            return;
        }

        setNicknames([{ value: nickname, label: <b>{nickname}</b> }]);
        if (nickname.length === 17) return;

        if (nickname.length > 2) {
            setLoading(true);
            ApiManager.searchNicks(nickname)
                .then(response_data => {
                    if (!response_data.data) return;

                    const data = response_data.data.map(nick => {
                        const first_pos = nick.name.toLowerCase().indexOf(nickname.toLowerCase());
                        const first = nick.name.slice(0, first_pos);
                        const middle = nick.name.slice(first_pos, first_pos + nickname.length);
                        const last = nick.name.slice(first_pos + nickname.length, nick.name.length);
                        const label = first_pos != -1 ? <>{first}<b className={Style.color}>{middle}</b>{last}</> : <>{nick.name}</>;

                        return {
                            value: `${nick?.name} – ${nick?.uuid}`,
                            label:
                                <div style={{ display: "flex", flexWrap: "nowrap", alignItems: "center" }}>
                                    <img alt="" src={"data:image/png;base64," + nick.head} width={32} style={{ marginRight: "3px", borderRadius: "10px" }} />
                                    {label}
                                </div>
                        }
                    })
                    setNicknames([
                        {
                            value: response_data.requestedFragment,
                            label: <b>{response_data.requestedFragment}</b>
                        },
                        {
                            label: <>Совпадения</>,
                            options: data
                        }
                    ]);
                })
                .finally(() => setLoading(false));
        }
    }

    return <Select
        value={nickValue}
        options={nicknames}
        className={`react-select-container`}
        classNamePrefix="react-select"
        isSearchable={true}
        onInputChange={(n, _) => fetch_nicknames(n)}
        inputValue={input}
        onChange={(n, _) => {
            if (n?.value) {
                setLoading(true);
                const nickname = n?.value;
                onChange(nickname.split(" – ").length > 1 ? nickname.split(" – ")[1] : nickname);
                setNickValue({ value: n.value, label: <div className={Style.p_div}>{n.label}</div> });
            }
            setLoading(false);
        }
        }
        isLoading={loading}
        id="nick_input"
        formatOptionLabel={nick_value => nick_value.label}
    />
}

export default Searcher;