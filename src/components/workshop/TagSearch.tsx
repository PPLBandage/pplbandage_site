'use client';

import { getTagsSuggestions } from '@/lib/apiManager';
import { debounce } from 'lodash';
import { useCallback, useEffect, useRef, useState } from 'react';
import Select, { GroupBase } from 'react-select';

type OptionSingle = {
    value: string;
    label: string;
};

const TagSearch = ({
    defaultValue,
    onChange
}: {
    defaultValue: string[];
    onChange: (tags: string[]) => void;
}) => {
    const [searchOptions, setSearchOptions] = useState<
        (OptionSingle | GroupBase<OptionSingle>)[]
    >([]);
    const [selectedTags, setSelectedTags] = useState<string[]>(defaultValue);
    const abortController = useRef<AbortController>(null);
    const tagsCache = useRef<Record<string, string[]>>({});

    useEffect(() => {
        onChange(selectedTags);
    }, [selectedTags]);

    const loadSuggestions = (newValue?: string) => {
        newValue = (newValue || '').slice(0, 20);
        const key = newValue.toLowerCase();

        if (tagsCache.current[key]) {
            updateSuggestions(tagsCache.current[key], newValue);
            return;
        }

        abortController.current?.abort?.();
        abortController.current = new AbortController();

        getTagsSuggestions(newValue, abortController.current.signal)
            .then(tags => {
                tagsCache.current[key] = tags;
                updateSuggestions(tags, newValue);
            })
            .catch(err => {
                console.log(err);

                if (newValue) {
                    setSearchOptions([
                        {
                            value: newValue,
                            label: `Новый тег: ${newValue}`
                        }
                    ]);
                } else {
                    setSearchOptions([]);
                }
            });
    };

    const updateSuggestions = (tags: string[], newValue?: string) => {
        const suggestions: (OptionSingle | GroupBase<OptionSingle>)[] = [];

        if (
            !!newValue &&
            !tags.map(tag => tag.toLowerCase()).includes(newValue.toLowerCase())
        ) {
            suggestions.push({
                value: newValue,
                label: `Новый тег: ${newValue}`
            });
        }

        suggestions.push({
            label: 'Совпадения',
            options: tags.map(tag => ({
                value: tag,
                label: tag
            }))
        });

        setSearchOptions(suggestions);
    };

    const debouncedFetch = useCallback(debounce(loadSuggestions, 100), []);
    return (
        <Select
            options={searchOptions}
            defaultValue={defaultValue.map(tag => ({ label: tag, value: tag }))}
            className={`react-select-container`}
            classNamePrefix="react-select"
            instanceId="select-68"
            onInputChange={(value, action) => {
                if (action.action === 'input-change') {
                    debouncedFetch(value);
                }
            }}
            onMenuOpen={debouncedFetch}
            onChange={evt => setSelectedTags(evt.map(tag => tag.value))}
            isOptionDisabled={() => selectedTags.length >= 10}
            isMulti
            isSearchable
        />
    );
};

export default TagSearch;
