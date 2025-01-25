"use client";

import { useEffect } from "react";
import { Table, Upload, Button, Input, Select } from "antd";
import {
    UploadOutlined,
    PlusOutlined,
    DeleteOutlined,
} from "@ant-design/icons";

import styles from "./page.module.scss";
import { serverUrl } from "constants/main";
import { useProductsStore } from "store/productsStore";
import { useClientsStore } from "store/clientsStore";

export default function Home() {
    const productsStore = useProductsStore();
    const clientsStore = useClientsStore();

    useEffect(() => {
        clientsStore.initClients();
        productsStore.initCategories();
        productsStore.initPackageTypes();
    }, []);

    const columns = [
        {
            title: "Клиент",
            dataIndex: "name",
            key: "name",
            fixed: "left",
            width: 170,
            render: (text, record) =>
                record.type == "client" ? <span>{text}</span> : null,
        },
        {
            title: "Название",
            dataIndex: "name",
            key: "name",
            fixed: "left",
            width: 170,
            render: (text, record) => {
                const onEnter = (e) =>
                    productsStore.changeProduct(
                        record.clientId,
                        record.id,
                        "name",
                        e.target.value,
                        "text",
                        true,
                    );
                return record.type == "product" ? (
                    <Input
                        size="small"
                        value={text}
                        onChange={(e) =>
                            productsStore.changeProduct(
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
            title: "Ширина",
            dataIndex: "width",
            key: "width",
            width: 110,
            render: (text, record) => {
                const onEnter = (e) =>
                    productsStore.changeProduct(
                        record.clientId,
                        record.id,
                        "width",
                        e.target.value,
                        "number",
                        true,
                    );
                return record.type == "product" ? (
                    <Input
                        size="small"
                        addonAfter="мм"
                        value={text}
                        onChange={(e) =>
                            productsStore.changeProduct(
                                record.clientId,
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
            title: "Высота",
            dataIndex: "height",
            key: "height",
            width: 110,
            render: (text, record) => {
                const onEnter = (e) =>
                    productsStore.changeProduct(
                        record.clientId,
                        record.id,
                        "height",
                        e.target.value,
                        "number",
                        true,
                    );
                return record.type == "product" ? (
                    <Input
                        size="small"
                        addonAfter="мм"
                        value={text}
                        onChange={(e) =>
                            productsStore.changeProduct(
                                record.clientId,
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
            title: "Глубина",
            dataIndex: "depth",
            key: "depth",
            width: 110,
            render: (text, record) => {
                const onEnter = (e) =>
                    productsStore.changeProduct(
                        record.clientId,
                        record.id,
                        "depth",
                        e.target.value,
                        "number",
                        true,
                    );
                return record.type == "product" ? (
                    <Input
                        size="small"
                        addonAfter="мм"
                        value={text}
                        onChange={(e) =>
                            productsStore.changeProduct(
                                record.clientId,
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
            title: "Вес",
            dataIndex: "weight",
            key: "weight",
            width: 110,
            render: (text, record) => {
                const onEnter = (e) =>
                    productsStore.changeProduct(
                        record.clientId,
                        record.id,
                        "weight",
                        e.target.value,
                        "number",
                        true,
                    );
                return record.type == "product" ? (
                    <Input
                        size="small"
                        addonAfter="гр"
                        value={text}
                        onChange={(e) =>
                            productsStore.changeProduct(
                                record.clientId,
                                record.id,
                                "weight",
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
            title: "Кол-во в упаковке",
            dataIndex: "count",
            key: "count",
            width: 110,
            render: (text, record) => {
                const onEnter = (e) =>
                    productsStore.changeProduct(
                        record.clientId,
                        record.id,
                        "count",
                        e.target.value,
                        "number",
                        true,
                    );
                return record.type == "product" ? (
                    <Input
                        size="small"
                        addonAfter="ед"
                        value={text}
                        onChange={(e) =>
                            productsStore.changeProduct(
                                record.clientId,
                                record.id,
                                "count",
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
            title: "Объем",
            dataIndex: "volume",
            key: "volume",
            width: 120,
            render: (text, record) => {
                const onEnter = (e) =>
                    productsStore.changeProduct(
                        record.clientId,
                        record.id,
                        "volume",
                        e.target.value,
                        "number",
                        true,
                    );
                return record.type == "product" ? (
                    <Input
                        size="small"
                        addonAfter="мм3"
                        value={text}
                        onChange={(e) =>
                            productsStore.changeProduct(
                                record.clientId,
                                record.id,
                                "volume",
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
            title: "Штрих-код",
            dataIndex: "qrcode",
            key: "qrcode",
            width: 200,
            render: (text, record) => {
                const onEnter = (e) =>
                    productsStore.changeProduct(
                        record.clientId,
                        record.id,
                        "qrcode",
                        e.target.value,
                        "text",
                        true,
                    );
                return record.type == "product" ? (
                    <Input
                        size="small"
                        value={text}
                        onChange={(e) =>
                            productsStore.changeProduct(
                                record.clientId,
                                record.id,
                                "qrcode",
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
            title: "Категория продукта",
            dataIndex: "categoryId",
            key: "categoryId",
            width: 120,
            render: (id, record) => {
                if (record.type == "product") {
                    let categoriesArr = [];
                    for (const categoryId in productsStore.categories) {
                        let category = productsStore.categories[categoryId];
                        category.id = categoryId;
                        categoriesArr.push(category);
                    }
                    console.log(id, productsStore.categories);
                    return (
                        <Select
                            size="small"
                            value={productsStore.categories[id]?.name}
                            placeholder="Категория продукта"
                            onChange={(value) =>
                                productsStore.changeProduct(
                                    record.clientId,
                                    record.id,
                                    "categoryId",
                                    value,
                                    "select",
                                    true,
                                )
                            }
                        >
                            {categoriesArr.map((category) => (
                                <Select.Option
                                    key={category.id}
                                    value={category.id}
                                >
                                    {category.name}
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
            title: "Вид упаковки",
            dataIndex: "packageTypeId",
            key: "packageTypeId",
            width: 120,
            render: (id, record) => {
                if (record.type == "product") {
                    let packageTypesArr = [];
                    for (const packageTypeId in productsStore.packageTypes) {
                        let packageType =
                            productsStore.packageTypes[packageTypeId];
                        packageType.id = packageTypeId;
                        packageTypesArr.push(packageType);
                    }
                    console.log(id, productsStore.packageTypes);
                    return (
                        <Select
                            size="small"
                            value={productsStore.packageTypes[id]?.name}
                            placeholder="Вид упаковки"
                            onChange={(value) =>
                                productsStore.changeProduct(
                                    record.clientId,
                                    record.id,
                                    "packageTypeId",
                                    value,
                                    "select",
                                    true,
                                )
                            }
                        >
                            {packageTypesArr.map((packageType) => (
                                <Select.Option
                                    key={packageType.id}
                                    value={packageType.id}
                                >
                                    {packageType.name}
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
            title: "Передняя проекция",
            dataIndex: "frontProjection",
            key: "frontProjection",
            width: 150,
            render: (text, record) => {
                console.log(text);
                return record.type == "product" ? (
                    <Upload
                        maxCount={1}
                        accept=".png"
                        action={`${serverUrl}/uploadfile?save_name="${text}"`}
                        onChange={async ({ file }) => {
                            if (
                                file.status == "done" &&
                                file.response.status == "ok"
                            ) {
                                await productsStore.changeProduct(
                                    record.clientId,
                                    record.id,
                                    "frontProjection",
                                    file.name,
                                    "file",
                                    true,
                                );
                            }
                        }}
                        defaultFileList={text == "" ? [] : [{ name: text }]}
                    >
                        <Button size="small" icon={<UploadOutlined />}>
                            Файл (.png)
                        </Button>
                    </Upload>
                ) : null;
            },
        },
        {
            title: "Действие",
            key: "action",
            width: 100,
            render: (text, record) =>
                record.children ? (
                    <Button
                        size="small"
                        type="primary"
                        icon={<PlusOutlined />}
                        onClick={() =>
                            productsStore.createProduct(Number(record.id))
                        }
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
                            productsStore.deleteProduct(
                                record.clientId,
                                record.id,
                            )
                        }
                    >
                        Удалить
                    </Button>
                ),
        },
    ];

    let clientsDataSource = [];
    let clients = clientsStore.clients;
    for (const clientId in clients) {
        const client = clientsStore.clients[clientId];

        let productsDataSource = [];
        let products = {};
        if (clientId in productsStore.products)
            products = productsStore.products[clientId];
        for (const productId in products) {
            const product = products[productId];
            productsDataSource.push({
                type: "product",
                key: `product-${productId}`,
                id: productId,
                clientId: clientId,
                ...product,
            });
        }

        clientsDataSource.push({
            type: "client",
            key: `client-${clientId}`,
            id: clientId,
            ...client,
            children: productsDataSource,
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
                        if (expanded) productsStore.initProducts(record.id);
                    }}
                    dataSource={clientsDataSource}
                    pagination={false}
                    scroll={{ x: "max-content", y: "calc(100%)" }}
                />
            </div>
        </main>
    );
}
