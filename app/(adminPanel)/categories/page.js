"use client";

import { useEffect } from "react";
import HorizontalTable from "components/HorizontalTable";

import styles from "./page.module.scss";
import { useProductsStore } from "store/productsStore";
import { useFilterStore } from "store/filterStore";

export default function Home() {
    const productsStore = useProductsStore();
    const filterStore = useFilterStore();

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
            name: "Создание",
            param: "created",
            type: "date",
            width: "150px",
        },
        {
            name: "Обновление",
            param: "updated",
            type: "date",
            width: "150px",
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
        const dataEl = {
            id: Number(categoryId),
            name: category.name,
            delete: true,
            copy: true,
            created: category.created,
            updated: category.updated,
        };

        data.push(dataEl);
    }
    data.push({
        id: "add",
    });

    useEffect(() => {
        productsStore.initCategories();
        filterStore.setFields(header, ["created", "updated"]);
    }, []);

    return (
        <main>
            <div className={styles.table}>
                <HorizontalTable data={data} header={header} />
            </div>
        </main>
    );
}
