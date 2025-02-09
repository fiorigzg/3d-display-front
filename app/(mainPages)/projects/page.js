"use client";

import { useEffect } from "react";
import { Table, Button, Input, Select, Typography } from "antd";
import {
    UploadOutlined,
    PlusOutlined,
    DeleteOutlined,
} from "@ant-design/icons";

import styles from "./page.module.scss";
import { useProjectsStore } from "store/projectsStore";
import { useClientsStore } from "store/clientsStore";
import { useProductsStore } from "store/productsStore";

const { Text } = Typography;

export default function Home() {
    const projectsStore = useProjectsStore();
    const productsStore = useProductsStore();
    const clientsStore = useClientsStore();

    useEffect(() => {
        clientsStore.initClients();
        projectsStore.initPrepackTypes();
    }, []);

    const rowParams = {
        client: {
            name: "клиента",
            nextName: "препроект",
        },
        project: {
            name: "препроект",
            nextName: "препак",
        },
        prepack: {
            name: "препак",
        },
    };

    const columns = [
        {
            title: "Клиент",
            dataIndex: "name",
            key: "clientName",
            fixed: "left",
            width: 150,
            render: (text, record) =>
                record.type === "client" ? <span>{text}</span> : null,
        },
        {
            title: "Препроект",
            dataIndex: "name",
            key: "projectName",
            fixed: "left",
            width: 150,
            render: (text, record) => {
                const onEnter = (e) =>
                    projectsStore.changeProject(
                        record.clientId,
                        record.id,
                        "name",
                        e.target.value,
                        "text",
                        true,
                    );
                return record.type == "project" ? (
                    <Input
                        size="small"
                        value={text}
                        onChange={(e) =>
                            projectsStore.changeProject(
                                record.clientId,
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
                ) : null;
            },
        },
        {
            title: "Препак",
            dataIndex: "name",
            key: "prepackName",
            fixed: "left",
            width: 150,
            render: (text, record) => {
                const onEnter = (e) =>
                    projectsStore.changePrepack(
                        record.projectId,
                        record.id,
                        "name",
                        e.target.value,
                        "text",
                        true,
                    );
                return record.type == "prepack" ? (
                    <Input
                        size="small"
                        value={text}
                        onChange={(e) =>
                            projectsStore.changePrepack(
                                record.projectId,
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
                ) : null;
            },
        },
        {
            title: "Номер препака",
            dataIndex: "prepackNumber",
            key: "number",
            width: 150,
            render: (text, record) =>
                record.type == "prepack" ? (
                    <Text size="small">123{text}</Text>
                ) : null,
        },
        {
            title: "Тип препака",
            dataIndex: "prepackTypeId",
            key: "prepackTypeId",
            width: 120,
            render: (id, record) => {
                if (record.type == "prepack") {
                    let prepackTypesArr = [];
                    for (const prepackTypeId in projectsStore.prepackTypes) {
                        let prepackType =
                            projectsStore.prepackTypes[prepackTypeId];
                        prepackType.id = prepackTypeId;
                        prepackTypesArr.push(prepackType);
                    }
                    return (
                        <Select
                            size="small"
                            value={projectsStore.prepackTypes[id]?.name}
                            placeholder="Тип препака"
                            style={{ width: 200 }}
                            onChange={(value) =>
                                projectsStore.changePrepack(
                                    record.projectId,
                                    record.id,
                                    "prepackTypeId",
                                    value,
                                    "number",
                                    true,
                                )
                            }
                        >
                            {prepackTypesArr.map((prepackType) => (
                                <Select.Option
                                    key={prepackType.id}
                                    value={prepackType.id}
                                >
                                    {prepackType.name}
                                </Select.Option>
                            ))}
                        </Select>
                    );
                } else {
                    return null;
                }
            },
        },
        {
            title: "Добавление",
            key: "action",
            width: 100,
            render: (text, record) =>
                record.type != "prepack" ? (
                    <Button
                        size="small"
                        type="primary"
                        icon={<PlusOutlined />}
                        onClick={() => {
                            if (record.type == "client")
                                projectsStore.createProject(record.id);
                            else if (record.type == "project")
                                projectsStore.createPrepack(record.id);
                        }}
                    >
                        Добавить {rowParams[record.type].nextName}
                    </Button>
                ) : null,
        },
        {
            title: "Удаление",
            key: "action",
            width: 100,
            render: (text, record) =>
                record.type !== "client" && record.type != "row" ? (
                    <Button
                        size="small"
                        type="primary"
                        danger
                        icon={<DeleteOutlined />}
                        onClick={() => {
                            if (record.type == "project")
                                projectsStore.deleteProject(
                                    record.clientId,
                                    record.id,
                                );
                            else if (record.type == "prepack")
                                projectsStore.deletePrepack(
                                    record.projectId,
                                    record.id,
                                );
                        }}
                    >
                        Удалить {rowParams[record.type].name}
                    </Button>
                ) : null,
        },
        {
            title: "Копирование",
            key: "action",
            width: 100,
            render: (text, record) =>
                record.type !== "client" && record.type != "row" ? (
                    <Button
                        size="small"
                        type="primary"
                        icon={<PlusOutlined />}
                        onClick={() => {
                            if (record.type == "project")
                                projectsStore.copyProject(
                                    record.clientId,
                                    record.id,
                                );
                            else if (record.type == "prepack")
                                projectsStore.copyPrepack(
                                    record.projectId,
                                    record.id,
                                );
                        }}
                    >
                        Копировать {rowParams[record.type].name}
                    </Button>
                ) : null,
        },
        {
            title: "Проектирование",
            key: "action",
            width: 100,
            render: (text, record) =>
                ["shelf", "prepack"].includes(record.type) ? (
                    <Button
                        size="small"
                        type="primary"
                        onClick={() => {
                            if (record.type == "prepack")
                                window.open(
                                    `/prepack?id=${record.id}&clientId=${record.clientId}`,
                                    // "mywin",
                                    // `width=${window.screen.availWidth / 2},height=${window.screen.availHeight}`,
                                );
                        }}
                    >
                        Спроектировать {rowParams[record.type].name}
                    </Button>
                ) : null,
        },
    ];

    let clientsDataSource = [];
    let clients = clientsStore.clients;
    for (const clientId in clients) {
        const client = clientsStore.clients[clientId];

        let projectsDataSource = [];
        let projects = {};
        if (clientId in projectsStore.projects)
            projects = projectsStore.projects[clientId];
        for (const projectId in projects) {
            const project = projects[projectId];

            let prepacksDataSource = [];
            let prepacks = {};
            if (projectId in projectsStore.prepacks)
                prepacks = projectsStore.prepacks[projectId];
            for (const prepackId in prepacks) {
                const prepack = prepacks[prepackId];
                prepacksDataSource.push({
                    ...prepack,
                    type: "prepack",
                    key: `prepack-${prepackId}`,
                    id: prepackId,
                    projectId: projectId,
                    clientId: clientId,
                });
            }

            projectsDataSource.push({
                ...project,
                type: "project",
                key: `project-${projectId}`,
                id: projectId,
                clientId: clientId,
                children: prepacksDataSource,
            });
        }

        clientsDataSource.push({
            ...client,
            type: "client",
            key: `client-${clientId}`,
            id: clientId,
            children: projectsDataSource,
        });
    }

    return (
        <main>
            <div className={styles.workingSpace}>
                <Table
                    className={styles.table}
                    size="small"
                    columns={columns}
                    onExpand={(expanded, record) => {
                        if (expanded) {
                            if (record.type == "client") {
                                projectsStore.initProjects(record.id);
                                productsStore.initProducts(record.id);
                            } else if (record.type == "project") {
                                projectsStore.initPrepacks(record.id);
                            } else if (record.type == "prepack") {
                                projectsStore.initShelves(record.id);
                            }
                        }
                    }}
                    dataSource={clientsDataSource}
                    pagination={false}
                    scroll={{ x: "max-content", y: "calc(100%)" }}
                />
            </div>
        </main>
    );
}
