import { useEffect, useState } from "react"
import { Category } from "../interfaces"
import { CategoryEl } from "./card.module";
import style from "@/app/styles/category_selector.module.css";

interface CategorySelectorProps {
    enabledCategories: Category[],
    allCategories: Category[]
}

const CategorySelector = ({enabledCategories, allCategories}: CategorySelectorProps) => {
    const [categories, setCategories] = useState<Category[]>(allCategories);

    const updateCategory = (id: number, enabled: boolean) => {
        setCategories((prevCategories) =>
            prevCategories.map((category) =>
                category.id === id ? { ...category, enabled: enabled } : category
            )
        );
    };

    useEffect(() => {
        const _categories = allCategories;
        const categories_sorted = _categories.map(cat => {
            cat.enabled = enabledCategories.some(category => category.id === cat.id);
            return cat;
        });
        setCategories(categories_sorted)
    }, [enabledCategories, allCategories]);

    const categoriesEnabled = categories.filter(el => el.enabled).map((el) => {
        return <CategoryEl key={el.id} enabled={true} category={el} onClick={() => updateCategory(el.id, false)} hoverable={true} />

    });
    const categoriesAvailable = categories.filter(el => !el.enabled).map((el) => {
        return <CategoryEl key={el.id} category={el} onClick={() => updateCategory(el.id, true)} hoverable={true} />
    });

    return  <div style={{marginBottom: "1rem"}}>
                <h3 style={{marginTop: "0", marginBottom: ".9rem"}}>Выбранные категории:</h3>
                <div className={style.container}>
                    {categoriesEnabled}
                </div>
                <hr/>
                <div className={style.container}>
                    {categoriesAvailable}
                </div>
            </div>;

}

export default CategorySelector;