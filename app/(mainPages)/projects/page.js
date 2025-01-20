"use client";

import { useEffect } from "react";
import { Table, Button, Input, Select } from "antd";
import {
    UploadOutlined,
    PlusOutlined,
    DeleteOutlined,
} from "@ant-design/icons";

import styles from "./page.module.scss";
import { useProjectsStore } from "store/projectsStore";
import { useClientsStore } from "store/clientsStore";
import { useProductsStore } from "store/productsStore";
import { makeShelf, makePrepack } from "api/projectsApi";

export default function Home() {
    const projectsStore = useProjectsStore();
    const productsStore = useProductsStore();
    const clientsStore = useClientsStore();

    useEffect(() => {
        projectsStore.initProjects();
        productsStore.initProducts();
        clientsStore.initClients();
    }, []);

    const columns = [
        {
            title: "Клиент",
            dataIndex: "name",
            key: "clientName",
            fixed: "left",
            width: 150,
            render: (text, record) =>
                record.fieldType === "client" ? <span>{text}</span> : <div />,
        },
        {
            title: "Препроект",
            dataIndex: "name",
            key: "projectName",
            fixed: "left",
            width: 150,
            render: (text, record) =>
                record.fieldType === "project" ? (
                    <Input
                        size="small"
                        value={text}
                        onChange={(e) =>
                            projectsStore.changeProject(
                                record.id,
                                "name",
                                e.target.value,
                                "text",
                            )
                        }
                    />
                ) : (
                    <div />
                ),
        },
        {
            title: "Препак",
            dataIndex: "name",
            key: "prepackName",
            fixed: "left",
            width: 150,
            render: (text, record) =>
                record.fieldType === "prepack" ? (
                    <Input
                        size="small"
                        value={text}
                        onChange={(e) =>
                            projectsStore.changePrepack(
                                record.id,
                                "name",
                                e.target.value,
                                "text",
                            )
                        }
                    />
                ) : (
                    <div />
                ),
        },
        {
            title: "Ширина препака",
            dataIndex: "width",
            key: "width",
            width: 110,
            render: (text, record) =>
                record.fieldType === "prepack" ? (
                    <Input
                        size="small"
                        value={text}
                        addonAfter="мм"
                        onChange={(e) =>
                            projectsStore.changePrepack(
                                record.id,
                                "width",
                                e.target.value,
                                "number",
                            )
                        }
                    />
                ) : (
                    <div />
                ),
        },
        {
            title: "Высота препака",
            dataIndex: "height",
            key: "height",
            width: 110,
            render: (text, record) =>
                record.fieldType === "prepack" ? (
                    <Input
                        size="small"
                        value={text}
                        addonAfter="мм"
                        onChange={(e) =>
                            projectsStore.changePrepack(
                                record.id,
                                "height",
                                e.target.value,
                                "number",
                            )
                        }
                    />
                ) : (
                    <div />
                ),
        },
        {
            title: "Глубина препака",
            dataIndex: "depth",
            key: "depth",
            width: 110,
            render: (text, record) =>
                record.fieldType === "prepack" ? (
                    <Input
                        size="small"
                        value={text}
                        addonAfter="мм"
                        onChange={(e) =>
                            projectsStore.changePrepack(
                                record.id,
                                "depth",
                                e.target.value,
                                "number",
                            )
                        }
                    />
                ) : (
                    <div />
                ),
        },
        {
            title: "Полка",
            dataIndex: "name",
            key: "shelfName",
            fixed: "left",
            width: 150,
            render: (text, record) =>
                record.fieldType === "shelf" ? <span>{text}</span> : <div />,
        },
        {
            title: "Отступ слева",
            dataIndex: "left",
            key: "left",
            width: 110,
            render: (text, record) =>
                record.fieldType === "row" ? (
                    <Input
                        size="small"
                        value={text}
                        addonAfter="мм"
                        onChange={(e) =>
                            projectsStore.changeRow(
                                record.shelfId,
                                record.id,
                                "left",
                                e.target.value,
                                "number",
                            )
                        }
                    />
                ) : (
                    <div />
                ),
        },
        {
            title: "Продукт",
            dataIndex: "productId",
            key: "productId",
            width: 150,
            render: (text, record) => {
                if (record.fieldType === "row") {
                    return (
                        <Select
                            size="small"
                            placeholder="Продукт"
                            value={record.productId}
                            onChange={(value) =>
                                projectsStore.changeRow(
                                    record.shelfId,
                                    record.id,
                                    "productId",
                                    value,
                                    "select",
                                )
                            }
                        >
                            {productsStore.products.map((product) => (
                                <Select.Option
                                    key={product.id}
                                    value={product.id}
                                >
                                    {product.name}
                                </Select.Option>
                            ))}
                        </Select>
                    );
                }
                return <div />;
            },
        },
        {
            title: "Добавление",
            key: "action",
            width: 100,
            render: (text, record) =>
                record.fieldType !== "row" ? (
                    <Button
                        size="small"
                        type="primary"
                        icon={<PlusOutlined />}
                        onClick={() => {
                            if (record.fieldType === "client")
                                projectsStore.createProject(record.id);
                            else if (record.fieldType === "project")
                                projectsStore.createPrepack(record.id);
                            else if (record.fieldType === "prepack")
                                projectsStore.createShelf(record.id);
                            else if (record.fieldType === "shelf")
                                projectsStore.createRow(record.id);
                        }}
                    >
                        Добавить
                    </Button>
                ) : (
                    <div />
                ),
        },
        {
            title: "Удаление",
            key: "action",
            width: 100,
            render: (text, record) =>
                record.fieldType !== "client" ? (
                    <Button
                        size="small"
                        type="primary"
                        danger
                        icon={<DeleteOutlined />}
                        onClick={() => {
                            if (record.fieldType === "project")
                                projectsStore.deleteProject(record.id);
                            else if (record.fieldType === "prepack")
                                projectsStore.deletePrepack(record.id);
                            else if (record.fieldType === "shelf")
                                projectsStore.deleteShelf(record.id);
                            else if (record.fieldType === "row")
                                projectsStore.deleteRow(
                                    record.shelfId,
                                    record.id,
                                );
                        }}
                    >
                        Удалить
                    </Button>
                ) : (
                    <div />
                ),
        },
        {
            title: "Проектирование",
            key: "action",
            width: 100,
            render: (text, record) =>
                ["shelf", "prepack"].includes(record.fieldType) ? (
                    <Button
                        size="small"
                        type="primary"
                        onClick={() => {
                            switch (record.fieldType) {
                                case "shelf":
                                    makeShelf(
                                        record,
                                        projectsStore.prepacks.find(
                                            (prepack) =>
                                                prepack.id == record.prepackId,
                                        ),
                                        productsStore.products,
                                    );
                                    return;
                                case "prepack":
                                    makePrepack(record);
                                    return;
                            }
                        }}
                    >
                        Спроектировать
                    </Button>
                ) : (
                    <div />
                ),
        },
    ];

    let shelves = projectsStore.shelves;
    let prepacks = projectsStore.prepacks;
    let projects = projectsStore.projects;
    let clients = clientsStore.clients;

    for (let shelf of shelves) {
        for (let row of shelf.rows) {
            row.fieldType = "row";
            row.key = `row-${row.id}`;
            row.shelfId = shelf.id;
        }

        shelf.fieldType = "shelf";
        shelf.key = `shelf-${shelf.id}`;
        shelf.children = shelf.rows;
    }

    const groupedShelves = prepacks.map((prepack) => {
        return {
            ...prepack,
            key: `prepack-${prepack.id}`,
            fieldType: "prepack",
            children: shelves.filter((shelf) => shelf.prepackId === prepack.id),
        };
    });

    for (let prepack of groupedShelves) {
        let shelfName = 1;
        for (let shelf of prepack.children) {
            shelf.name = shelfName;
            shelfName++;
        }
    }

    const groupedPrepacks = projects.map((project) => {
        return {
            ...project,
            key: `project-${project.id}`,
            fieldType: "project",
            children: groupedShelves.filter(
                (prepack) => prepack.projectId === project.id,
            ),
        };
    });

    const groupedClients = clients.map((client) => {
        return {
            ...client,
            key: `client-${client.id}`,
            fieldType: "client",
            children: groupedPrepacks.filter(
                (project) => project.clientId === client.id,
            ),
        };
    });

    return (
        <main>
            <div className={styles.workingSpace}>
                <Table
                    className={styles.table}
                    size="small"
                    columns={columns}
                    dataSource={groupedClients}
                    pagination={false}
                    scroll={{ x: "max-content", y: "calc(100%)" }}
                />
            </div>
        </main>
    );
}
