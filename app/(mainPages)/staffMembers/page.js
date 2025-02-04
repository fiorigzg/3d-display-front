"use client";

import { useEffect } from "react";
import { Table, Button, Input } from "antd";
import { PlusOutlined, DeleteOutlined } from "@ant-design/icons";

import styles from "./page.module.scss";
import { useStaffStore } from "store/staffStore";

export default function Home() {
    const staffStore = useStaffStore();

    useEffect(() => {
        staffStore.initMembers();
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
                    staffStore.changeMember(
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
                            staffStore.changeMember(
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
                        onClick={() => staffStore.createMember()}
                    >
                        Добавить
                    </Button>
                ) : (
                    <Button
                        size="small"
                        type="primary"
                        danger
                        icon={<DeleteOutlined />}
                        onClick={() => staffStore.deleteMember(record.id)}
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
                        onClick={() => staffStore.copyMember(record.id)}
                    >
                        Копировать
                    </Button>
                ) : null,
        },
    ];

    let dataSource = [];
    for (const memberId in staffStore.members) {
        const member = staffStore.members[memberId];
        dataSource.push({
            ...member,
            id: memberId,
            action: "other",
            key: memberId,
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
