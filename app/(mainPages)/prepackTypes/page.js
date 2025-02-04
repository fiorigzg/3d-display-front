"use client";

import { useEffect } from "react";
import { Table, Button, Input } from "antd";
import { PlusOutlined, DeleteOutlined } from "@ant-design/icons";

import styles from "./page.module.scss";
import { useProjectsStore } from "store/projectsStore";

export default function Home() {
    const projectsStore = useProjectsStore();

    useEffect(() => {
        projectsStore.initPrepackTypes();
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
                    projectsStore.changePrepackType(
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
                            projectsStore.changePrepackType(
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
                        onClick={() => projectsStore.createPrepackType()}
                    >
                        Добавить
                    </Button>
                ) : (
                    <Button
                        size="small"
                        type="primary"
                        danger
                        icon={<DeleteOutlined />}
                        onClick={() =>
                            projectsStore.deletePrepackType(record.id)
                        }
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
                        onClick={() => projectsStore.copyPrepackType(record.id)}
                    >
                        Копировать
                    </Button>
                ) : null,
        },
    ];

    let dataSource = [];
    for (const prepackTypeId in projectsStore.prepackTypes) {
        const prepackType = projectsStore.prepackTypes[prepackTypeId];
        dataSource.push({
            ...prepackType,
            action: "other",
            key: prepackTypeId,
            id: prepackTypeId,
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
