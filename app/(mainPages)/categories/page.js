"use client";

import { useEffect } from 'react';
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
            render: (text, record) =>
                text == null ? null : (
                    <Input
                        size="small"
                        value={text}
                        onChange={(e) =>
                            productsStore.changeCategory(
                                record.id,
                                "name",
                                e.target.value,
                                "text",
                            )
                        }
                    />
                ),
        },
        {
            title: "Действие",
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
    ];

    let dataSource = [];
    for (const category of productsStore.categories) {
        dataSource.push({ ...category, action: "delete" });
    }
    dataSource.push({ id: null, name: null, action: "add" });

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
