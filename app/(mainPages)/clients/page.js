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
            render: (text, record) => {
                const onEnter = (e) =>
                    clientsStore.changeClient(
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
                            clientsStore.changeClient(
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
    for (const clientId in clientsStore.clients) {
        const client = clientsStore.clients[clientId];
        dataSource.push({
            ...client,
            key: clientId,
            id: clientId,
            action: "delete",
        });
    }
    dataSource.push({ key: "add", id: null, name: null, action: "add" });

    return (
        <main>
            <div className={styles.workingSpace}>
                <Table
                    className={styles.table}
                    size="small"
                    columns={columns}
                    dataSource={dataSource}
                    pagination={false}
                    scroll={{ x: "max-content", y: "100%" }}
                />
            </div>
        </main>
    );
}
