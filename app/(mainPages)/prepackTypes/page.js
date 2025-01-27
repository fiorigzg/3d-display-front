"use client";

import { useEffect } from "react";
import { Table, Button, Select } from "antd";
import { PlusOutlined, DeleteOutlined } from "@ant-design/icons";

import styles from "./page.module.scss";
import { useProjectsStore } from "store/projectsStore";

const prepackTypeNames = [
    "1/4 напольный патент",
    "1/4 напольный эконом",
    "1/4 напольный на держателях",
    "1/4 напольный обейджик",
    "1/8 напольный патент",
    "1/8 напольный эконом",
    "1/8 напольный на держателях",
    "1/8 напольный обейджик",
    "Подвесной",
];

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
            width: 200,
            render: (text, record) =>
                text == null ? null : (
                    <Select
                        size="small"
                        value={text}
                        placeholder="Название"
                        style={{
                            width: "250px",
                        }}
                        onChange={(value) =>
                            projectsStore.changePrepackType(
                                record.id,
                                "name",
                                value,
                                "text",
                                true,
                            )
                        }
                    >
                        {prepackTypeNames.map((prepackTypeName) => (
                            <Select.Option
                                key={prepackTypeName}
                                value={prepackTypeName}
                            >
                                {prepackTypeName}
                            </Select.Option>
                        ))}
                    </Select>
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
    ];

    let dataSource = [];
    for (const prepackTypeId in projectsStore.prepackTypes) {
        const prepackType = projectsStore.prepackTypes[prepackTypeId];
        dataSource.push({
            ...prepackType,
            action: "delete",
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
