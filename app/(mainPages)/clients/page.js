"use client";

import { useEffect } from "react";
import { Table, Button, Input } from "antd";
import { PlusOutlined, DeleteOutlined } from "@ant-design/icons";

import styles from "./page.module.scss";
import { useClientsStore } from "store/clientsStore";

export default function Home() {
    const clientsStore = useClientsStore();

    useEffect(() => {
        clientsStore.initClients();
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
                            clientsStore.changeClient(
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
                        onClick={() => clientsStore.createClient()}
                    >
                        Добавить
                    </Button>
                ) : (
                    <Button
                        size="small"
                        type="primary"
                        danger
                        icon={<DeleteOutlined />}
                        onClick={() => clientsStore.deleteClient(record.id)}
                    >
                        Удалить
                    </Button>
                ),
        },
    ];

    let dataSource = [];
    for (const client of clientsStore.clients) {
        dataSource.push({ ...client, action: "delete" });
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
