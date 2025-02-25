"use client";

import { useEffect } from "react";
import HorizontalTable from "components/HorizontalTable";

import styles from "./page.module.scss";
import { useProductsStore } from "store/productsStore";

export default function Home() {
    const productsStore = useProductsStore();

    useEffect(() => {
        productsStore.initCategories();
    }, []);

    const header = [
        {
            name: "Категория",
            param: "id",
            type: "id",
            width: "100px",
            onAdd: (ids) => productsStore.createCategory(),
        },
        {
            name: "Удаление",
            type: "button",
            icon: "delete",
            param: "delete",
            width: "50px",
            onClick: (ids) => productsStore.deleteCategory(ids.id),
        },
        {
            name: "Копирование",
            type: "button",
            icon: "copy",
            param: "copy",
            width: "50px",
            onClick: (ids) => productsStore.copyCategory(ids.id),
        },
        {
            name: "Название",
            param: "name",
            type: "input",
            isNumber: false,
            width: "calc(100% - 200px)",
            minWidth: "300px",
            onEnter: (ids, value) =>
                productsStore.changeCategory(
                    ids.id,
                    "name",
                    value,
                    "text",
                    true,
                ),
        },
    ];

    let data = [];
    for (const categoryId in productsStore.categories) {
        const category = productsStore.categories[categoryId];
        data.push({
            id: categoryId,
            name: category.name,
            delete: true,
            copy: true,
        });
    }
    data.push({
        id: "add",
    });

    return (
        <main>
            <div className={styles.workingSpace}>
                <HorizontalTable data={data} header={header} />
            </div>
        </main>
    );
}
