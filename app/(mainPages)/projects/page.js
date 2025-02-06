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
            nextName: "полку",
        },
        shelf: {
            name: "полку",
            nextName: "ряд",
        },
        row: {
            name: "ряд",
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
            title: "Ширина препака",
            dataIndex: "width",
            key: "width",
            width: 110,
            render: (text, record) => {
                const onEnter = (e) =>
                    projectsStore.changePrepack(
                        record.projectId,
                        record.id,
                        "width",
                        e.target.value,
                        "text",
                        true,
                    );
                return record.type == "prepack" ? (
                    <Input
                        size="small"
                        value={text}
                        addonAfter="мм"
                        onChange={(e) =>
                            projectsStore.changePrepack(
                                record.projectId,
                                record.id,
                                "width",
                                e.target.value,
                                "number",
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
            title: "Высота препака",
            dataIndex: "height",
            key: "prepackHeight",
            width: 110,
            render: (text, record) => {
                const onEnter = (e) =>
                    projectsStore.changePrepack(
                        record.projectId,
                        record.id,
                        "height",
                        e.target.value,
                        "text",
                        true,
                    );
                return record.type == "prepack" ? (
                    <Input
                        size="small"
                        value={text}
                        addonAfter="мм"
                        onChange={(e) =>
                            projectsStore.changePrepack(
                                record.projectId,
                                record.id,
                                "height",
                                e.target.value,
                                "number",
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
            title: "Глубина препака",
            dataIndex: "depth",
            key: "depth",
            width: 110,
            render: (text, record) => {
                const onEnter = (e) =>
                    projectsStore.changePrepack(
                        record.projectId,
                        record.id,
                        "depth",
                        e.target.value,
                        "text",
                        true,
                    );
                return record.type == "prepack" ? (
                    <Input
                        size="small"
                        value={text}
                        addonAfter="мм"
                        onChange={(e) =>
                            projectsStore.changePrepack(
                                record.projectId,
                                record.id,
                                "depth",
                                e.target.value,
                                "number",
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
            title: "Полка",
            dataIndex: "name",
            key: "shelfName",
            fixed: "left",
            width: 80,
            render: (text, record) =>
                record.type == "shelf" ? <span>{text}</span> : null,
        },
        {
            title: "Высота полки",
            dataIndex: "height",
            key: "shelfHeight",
            width: 110,
            render: (text, record) => {
                const onEnter = (e) =>
                    projectsStore.changeShelf(
                        record.prepackId,
                        record.id,
                        "height",
                        e.target.value,
                        "text",
                        true,
                    );
                return record.type == "shelf" ? (
                    <Input
                        size="small"
                        value={text}
                        addonAfter="мм"
                        onChange={(e) =>
                            projectsStore.changeShelf(
                                record.prepackId,
                                record.id,
                                "height",
                                e.target.value,
                                "number",
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
            title: "Отступ слева",
            dataIndex: "left",
            key: "left",
            width: 110,
            render: (text, record) => {
                const onEnter = (e) =>
                    projectsStore.changeRow(
                        record.prepackId,
                        record.shelfId,
                        record.id,
                        "left",
                        e.target.value,
                        "number",
                        true,
                    );
                return record.type == "row" ? (
                    <Input
                        size="small"
                        value={text}
                        addonAfter="мм"
                        onChange={(e) =>
                            projectsStore.changeRow(
                                record.prepackId,
                                record.shelfId,
                                record.id,
                                "left",
                                e.target.value,
                                "number",
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
            title: "Продукт",
            dataIndex: "productId",
            key: "productId",
            width: 150,
            render: (id, record) => {
                if (record.type == "row") {
                    let productsArr = [];
                    for (const productId in productsStore.products[
                        record.clientId
                    ]) {
                        let product =
                            productsStore.products[record.clientId][productId];
                        product.id = productId;
                        productsArr.push(product);
                    }
                    return (
                        <Select
                            size="small"
                            value={
                                productsStore.products[record.clientId][id]
                                    ?.name
                            }
                            placeholder="Продукта"
                            onChange={(value) =>
                                projectsStore.changeRow(
                                    record.prepackId,
                                    record.shelfId,
                                    record.id,
                                    "productId",
                                    value,
                                    "number",
                                    true,
                                )
                            }
                        >
                            {productsArr.map((product) => (
                                <Select.Option
                                    key={product.id}
                                    value={product.id}
                                >
                                    {product.name}
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
                record.type != "row" ? (
                    <Button
                        size="small"
                        type="primary"
                        icon={<PlusOutlined />}
                        onClick={() => {
                            if (record.type == "client")
                                projectsStore.createProject(record.id);
                            else if (record.type == "project")
                                projectsStore.createPrepack(record.id);
                            else if (record.type == "prepack")
                                projectsStore.createShelf(record.id);
                            else if (record.type == "shelf")
                                projectsStore.createRow(
                                    record.prepackId,
                                    record.id,
                                );
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
                            else if (record.type == "shelf")
                                projectsStore.deleteShelf(
                                    record.prepackId,
                                    record.id,
                                );
                            else if (record.type == "row")
                                projectsStore.deleteRow(
                                    record.prepackId,
                                    record.shelfId,
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
                            else if (record.type == "shelf")
                                projectsStore.copyShelf(
                                    record.prepackId,
                                    record.id,
                                );
                            else if (record.type == "row")
                                projectsStore.copyRow(
                                    record.prepackId,
                                    record.shelfId,
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
                            if (record.type == "shelf") {
                                makeShelf(
                                    projectsStore.prepacks[record.projectId][
                                        record.prepackId
                                    ],
                                    record,
                                    productsStore.products[record.clientId],
                                );
                            } else if (record.type == "prepack") {
                                makePrepack(
                                    record,
                                    projectsStore.shelves[record.id],
                                    productsStore.products[record.clientId],
                                );
                            }
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

                let shelvesDataSource = [];
                let shelves = {};
                if (prepackId in projectsStore.shelves)
                    shelves = projectsStore.shelves[prepackId];
                let shelfName = 1;
                for (const shelfId in shelves) {
                    const shelf = shelves[shelfId];

                    for (const rowId in shelf.rows) {
                        let row = shelf.rows[rowId];
                        row.key = `row-${rowId}`;
                        row.id = Number(rowId);
                        row.shelfId = Number(shelfId);
                        row.prepackId = Number(prepackId);
                        row.projectId = Number(projectId);
                        row.clientId = Number(clientId);
                        row.type = "row";
                    }

                    shelvesDataSource.push({
                        ...shelf,
                        type: "shelf",
                        key: `shelf-${shelfId}`,
                        name: shelfName,
                        id: shelfId,
                        prepackId: prepackId,
                        projectId: projectId,
                        clientId: clientId,
                        children: shelf.rows,
                    });
                    shelfName++;
                }

                prepacksDataSource.push({
                    ...prepack,
                    type: "prepack",
                    key: `prepack-${prepackId}`,
                    id: prepackId,
                    projectId: projectId,
                    clientId: clientId,
                    children: shelvesDataSource,
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
