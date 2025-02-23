"use client";

import { useEffect } from "react";
import { Table, Button, Input } from "antd";
import { PlusOutlined, DeleteOutlined } from "@ant-design/icons";

import styles from "./page.module.scss";
import { useClientsStore } from "store/clientsStore";
import HorizontalTable from "components/HorizontalTable";

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
            title: "Добавление/удаление",
            dataIndex: "action",
            key: "addOrDelete",
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
                        onClick={() => clientsStore.copyClient(record.id)}
                    >
                        Копировать
                    </Button>
                ) : null,
        },
    ];

    const header = [
        {
            name: "Клиент",
            param: "id",
            type: "id",
            width: "50px",
        },
        {
            name: "Название",
            param: "name",
            type: "input",
            isNumber: false,
            width: "200px",
            onEnter: (ids, value) =>
                clientsStore.changeClient(ids.id, "name", value, "text", true),
        },
        {
            name: "Добавление",
            type: "button",
            param: "add",
            width: "140px",
            onClick: (ids) => clientsStore.createClient(),
        },
        {
            name: "Удаление",
            type: "button",
            param: "delete",
            width: "140px",
            onClick: (ids) => clientsStore.deleteClient(ids.id),
        },
        {
            name: "Копирование",
            type: "button",
            param: "copy",
            width: "140px",
            onClick: (ids) => clientsStore.copyClient(ids.id),
        },
    ];

    let data = [];
    console.log(clientsStore.clients);
    data.push({
        add: true,
    });
    for (const clientId in clientsStore.clients) {
        const client = clientsStore.clients[clientId];
        data.push({
            id: clientId,
            name: client.name,
            add: false,
            delete: true,
            copy: true,
        });
    }

    return (
        <main>
            <div className={styles.workingSpace}>
                <HorizontalTable data={data} header={header} />
            </div>
        </main>
    );
}
