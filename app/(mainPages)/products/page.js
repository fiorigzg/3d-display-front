"use client";

import { useEffect } from "react";
import { Table, Upload, Button, Input, Select } from "antd";
import {
    UploadOutlined,
    PlusOutlined,
    DeleteOutlined,
} from "@ant-design/icons";

import styles from "./page.module.scss";
import { useProductsStore } from "store/productsStore";
import { useClientsStore } from "store/clientsStore";

export default function Home() {
    const productsStore = useProductsStore();
    const clientsStore = useClientsStore();

    useEffect(() => {
        productsStore.initProducts();
        clientsStore.initClients();
    }, []);

    const columns = [
        {
            title: "Клиент",
            dataIndex: "clientName",
            key: "clientName",
            fixed: "left",
            width: 170,
            render: (text, record) =>
                record.children ? (
                    <span>{text}</span>
                ) : (
                    <span>{record.clientName}</span>
                ),
        },
        {
            title: "Название",
            dataIndex: "name",
            key: "name",
            fixed: "left",
            width: 170,
            render: (text, record) =>
                record.children ? null : (
                    <Input
                        size="small"
                        value={text}
                        onChange={(e) =>
                            productsStore.changeProduct(
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
            title: "Ширина",
            dataIndex: "width",
            key: "width",
            width: 110,
            render: (text, record) =>
                record.children ? null : (
                    <Input
                        size="small"
                        addonAfter="мм"
                        value={text}
                        onChange={(e) =>
                            productsStore.changeProduct(
                                record.id,
                                "width",
                                e.target.value,
                                "number",
                            )
                        }
                    />
                ),
        },
        {
            title: "Высота",
            dataIndex: "height",
            key: "height",
            width: 110,
            render: (text, record) =>
                record.children ? null : (
                    <Input
                        size="small"
                        addonAfter="мм"
                        value={text}
                        onChange={(e) =>
                            productsStore.changeProduct(
                                record.id,
                                "height",
                                e.target.value,
                                "number",
                            )
                        }
                    />
                ),
        },
        {
            title: "Глубина",
            dataIndex: "depth",
            key: "depth",
            width: 110,
            render: (text, record) =>
                record.children ? null : (
                    <Input
                        size="small"
                        addonAfter="мм"
                        value={text}
                        onChange={(e) =>
                            productsStore.changeProduct(
                                record.id,
                                "depth",
                                e.target.value,
                                "number",
                            )
                        }
                    />
                ),
        },
        {
            title: "Вес",
            dataIndex: "weight",
            key: "weight",
            width: 110,
            render: (text, record) =>
                record.children ? null : (
                    <Input
                        size="small"
                        addonAfter="гр"
                        value={text}
                        onChange={(e) =>
                            productsStore.changeProduct(
                                record.id,
                                "weight",
                                e.target.value,
                                "number",
                            )
                        }
                    />
                ),
        },
        {
            title: "Кол-во в упаковке",
            dataIndex: "count",
            key: "count",
            width: 110,
            render: (text, record) =>
                record.children ? null : (
                    <Input
                        size="small"
                        addonAfter="ед"
                        value={text}
                        onChange={(e) =>
                            productsStore.changeProduct(
                                record.id,
                                "count",
                                e.target.value,
                                "number",
                            )
                        }
                    />
                ),
        },
        {
            title: "Объем",
            dataIndex: "volume",
            key: "volume",
            width: 120,
            render: (text, record) =>
                record.children ? null : (
                    <Input
                        size="small"
                        addonAfter="мм2"
                        value={text}
                        onChange={(e) =>
                            productsStore.changeProduct(
                                record.id,
                                "volume",
                                e.target.value,
                                "number",
                            )
                        }
                    />
                ),
        },
        {
            title: "Штрих-код",
            dataIndex: "qrcode",
            key: "qrcode",
            width: 200,
            render: (text, record) =>
                record.children ? null : (
                    <Input
                        size="small"
                        value={text}
                        onChange={(e) =>
                            productsStore.changeProduct(
                                record.id,
                                "qrcode",
                                e.target.value,
                                "number",
                            )
                        }
                    />
                ),
        },
        {
            title: "Категория продукта",
            dataIndex: "categoryId",
            key: "categoryId",
            width: 120,
            render: (text, record) =>
                record.children ? (
                    <div />
                ) : (
                    <Select
                        size="small"
                        value={text}
                        placeholder="Категория продукта"
                        onChange={(value) =>
                            productsStore.changeProduct(
                                record.id,
                                "category",
                                value,
                                "select",
                            )
                        }
                    >
                        {productsStore.categories.map((category) => (
                            <Select.Option
                                key={category.id}
                                value={category.id}
                            >
                                {category.name}
                            </Select.Option>
                        ))}
                    </Select>
                ),
        },
        {
            title: "Вид упаковки",
            dataIndex: "packageTypeId",
            key: "packageTypeId",
            width: 120,
            render: (text, record) =>
                record.children ? null : (
                    <Select
                        size="small"
                        value={text}
                        placeholder="Выберите"
                        onChange={(value) =>
                            productsStore.changeProduct(
                                record.id,
                                "packageTypeId",
                                value,
                                "select",
                            )
                        }
                    >
                        {productsStore.packageTypes.map((packageType) => (
                            <Select.Option
                                key={packageType.id}
                                value={packageType.id}
                            >
                                {packageType.name}
                            </Select.Option>
                        ))}
                    </Select>
                ),
        },
        {
            title: "Объект товара",
            dataIndex: "object",
            key: "object",
            width: 150,
            render: (file, record) =>
                record.children ? null : (
                    <Upload
                        maxCount={1}
                        accept=".obj"
                        beforeUpload={(file) => {
                            productsStore.changeProduct(
                                record.id,
                                "object",
                                file,
                                "file",
                            );
                            // Prevent upload default behavior
                            return false;
                        }}
                        defaultFileList={file == null ? [] : [file]}
                    >
                        <Button size="small" icon={<UploadOutlined />}>
                            Файл (.obj)
                        </Button>
                    </Upload>
                ),
        },
        {
            title: "Передняя проекция",
            dataIndex: "frontProjection",
            key: "frontProjection",
            width: 150,
            render: (file, record) =>
                record.children ? null : (
                    <Upload
                        maxCount={1}
                        accept=".png"
                        beforeUpload={(file) => {
                            productsStore.changeProduct(
                                record.id,
                                "frontProjection",
                                file,
                                "file",
                            );
                            return false;
                        }}
                        defaultFileList={file == null ? [] : [file]}
                    >
                        <Button size="small" icon={<UploadOutlined />}>
                            Файл (.png)
                        </Button>
                    </Upload>
                ),
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
                            productsStore.createProduct(record.clientId)
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
                        onClick={() => productsStore.deleteProduct(record.id)}
                    >
                        Удалить
                    </Button>
                ),
        },
    ];

    const groupedProducts = Object.values(
        productsStore.products.reduce((acc, item) => {
            if (!acc[item.clientId]) {
                acc[item.clientId] = {
                    clientId: item.clientId,
                    products: [],
                };
            }
            acc[item.clientId].products.push(item);
            return acc;
        }, {}),
    );

    let dataSource = [];

    for (const client of clientsStore.clients) {
        let data = {
            key: client.id, // add key for each client
            clientName: client.name,
            clientId: client.id,
            children: [],
        };

        let productsGroup = groupedProducts.find(
            (productsGroup) => productsGroup.clientId == client.id,
        );

        if (productsGroup != undefined) {
            data.children = productsGroup.products.map((product) => ({
                ...product,
                key: product.id, // add key for each product
            }));
        }

        dataSource.push(data);
    }

    console.log(dataSource);

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
