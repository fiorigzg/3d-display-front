"use client";

import { useEffect } from "react";
import { Table, Button, Input } from "antd";
import { PlusOutlined, DeleteOutlined } from "@ant-design/icons";

import styles from "./page.module.scss";
import { useProductsStore } from "store/productsStore";

export default function Home() {
    const productsStore = useProductsStore();

    useEffect(() => {
        productsStore.initCategories();
    }, []);

    const columns = [
        {
            title: "Название",
            dataIndex: "name",
            key: "name",
            fixed: "left",
            width: 170,
            render: (text, record) => {
                const onEnter = (e) =>
                    productsStore.changeCategory(
                        record.id,
                        "name",
                        e.target.value,
                        "text",
                        true,
                    );
                return text == null ? null : (
                    <Input
                        size="small"
                        value={text}
                        onChange={(e) =>
                            productsStore.changeCategory(
                                record.id,
                                "name",
                                e.target.value,
                                "text",
                                false,
                            )
                        }
                        onBlur={onEnter}
                        onPressEnter={onEnter}
                    />
                );
            },
        },
        {
            title: "Добавление/удаление",
            dataIndex: "action",
            key: "action",
            width: 100,
            render: (text, record) =>
                text == "add" ? (
                    <Button
                        size="small"
                        type="primary"
                        icon={<PlusOutlined />}
                        onClick={() => productsStore.createCategory()}
                    >
                        Добавить
                    </Button>
                ) : (
                    <Button
                        size="small"
                        type="primary"
                        danger
                        icon={<DeleteOutlined />}
                        onClick={() => productsStore.deleteCategory(record.id)}
                    >
                        Удалить
                    </Button>
                ),
        },
        {
            title: "Копирование",
            dataIndex: "action",
            key: "copy",
            width: 100,
            render: (text, record) =>
                text == "other" ? (
                    <Button
                        size="small"
                        type="primary"
                        icon={<PlusOutlined />}
                        onClick={() => productsStore.copyCategory(record.id)}
                    >
                        Копировать
                    </Button>
                ) : null,
        },
    ];

    let dataSource = [];
    for (const categoryId in productsStore.categories) {
        const category = productsStore.categories[categoryId];
        dataSource.push({
            ...category,
            id: categoryId,
            action: "other",
            key: categoryId,
        });
    }
    dataSource.push({ id: null, name: null, action: "add", key: "add" });

    return (
        <main>
            <div className={styles.workingSpace}>
                <Table
                    className={styles.table}
                    size="small"
                    columns={columns}
                    dataSource={dataSource}
                    pagination={false}
                    scroll={{ x: "max-content", y: "calc(100%)" }}
                />
            </div>
        </main>
    );
}
