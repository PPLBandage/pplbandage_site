import { useEffect, useState } from 'react';
import { Category } from '@/types/global.d';
import { CategoryEl } from '@/components/Card';
import style from '@/styles/category_selector.module.css';
import style_workshop from '@/styles/workshop/page.module.css';
import IconSvg from '@/resources/icon.svg';

interface CategorySelectorProps {
    enabledCategories: Category[];
    allCategories: Category[];
    onChange(selected: number[]): void;
}

const CategorySelector = ({
    enabledCategories,
    allCategories,
    onChange
}: CategorySelectorProps) => {
    const [categories, setCategories] = useState<Category[]>(allCategories);

    const updateCategory = (id: number, enabled: boolean) => {
        setCategories(prevCategories =>
            prevCategories.map(category =>
                category.id === id
                    ? { ...category, enabled: enabled }
                    : category
            )
        );
    };

    useEffect(() => {
        const categories_sorted = allCategories.map(cat => {
            if (!enabledCategories) {
                cat.enabled = false;
                return cat;
            }
            cat.enabled = enabledCategories.some(
                category => category.id === cat.id
            );
            return cat;
        });
        setCategories(categories_sorted);
    }, [enabledCategories, allCategories]);

    useEffect(() => {
        onChange(categories.filter(el => el.enabled).map(i => i.id));
    }, [categories]);

    const categoriesEnabled = categories
        .filter(el => el.enabled)
        .map(el => (
            <CategoryEl
                key={el.id}
                enabled={true}
                category={el}
                onClick={() => updateCategory(el.id, false)}
                hoverable={true}
            />
        ));
    const categoriesAvailable = categories
        .filter(el => !el.enabled)
        .map(el => (
            <CategoryEl
                key={el.id}
                category={el}
                onClick={() => updateCategory(el.id, true)}
                hoverable={true}
            />
        ));

    return (
        <div>
            <h4 style={{ margin: 0, marginBottom: '.9rem' }}>
                Выбранные категории:
            </h4>
            <div className={style.container}>
                {categoriesEnabled.length > 0 ? (
                    categoriesEnabled
                ) : (
                    <p className={style.no_categories}>Категории не выбраны</p>
                )}
            </div>
            <hr />
            <div className={style.container}>
                {allCategories.length > 0 ? (
                    categoriesAvailable
                ) : (
                    <IconSvg
                        width={48}
                        height={48}
                        className={style_workshop.loading}
                    />
                )}
            </div>
        </div>
    );
};

export default CategorySelector;
