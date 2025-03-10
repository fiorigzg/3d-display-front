"use client";

import { useEffect, useState } from "react";
import { Button } from "antd";
import {
    UploadOutlined,
    PlusOutlined,
    DeleteOutlined,
} from "@ant-design/icons";

import styles from "./page.module.scss";
import { useProductsStore } from "store/productsStore";
import { useClientsStore } from "store/clientsStore";
import { useFilterStore } from "store/filterStore";
import HorizontalTable from "components/HorizontalTable";
import getOptions from "components/getOptions";
import isFiltred from "components/isFiltred";

export default function Home() {
    const productsStore = useProductsStore();
    const clientsStore = useClientsStore();
    const filterStore = useFilterStore();
    const [extendedClients, setExtendedClients] = useState({});

    const header = [
        {
            name: "Клиент",
            param: "clientId",
            type: "id",
            width: "100px",
            onSwitchExtend: (id) => {
                if (!(id in productsStore.products)) {
                    productsStore.initProducts(id);
                    setExtendedClients({ ...extendedClients, [id]: true });
                } else {
                    setExtendedClients({
                        ...extendedClients,
                        [id]: !extendedClients[id],
                    });
                }
            },
        },
        {
            name: "Создание клиента",
            param: "clientCreated",
            type: "date",
            width: "200px",
        },
        {
            name: "Обновление клиента",
            param: "clientUpdated",
            type: "date",
            width: "200px",
        },
        {
            name: "Имя клиента",
            param: "clientName",
            type: "const",
            width: "200px",
        },
        {
            name: "Продукт",
            param: "productId",
            accessor: "productId",
            type: "id",
            width: "100px",
            onAdd: (ids) => productsStore.createProduct(ids.clientId),
        },
        {
            name: "Создание продукта",
            param: "productCreated",
            type: "date",
            width: "200px",
        },
        {
            name: "Обновление продукта",
            param: "productUpdated",
            type: "date",
            width: "200px",
        },
        {
            name: "Удаление",
            param: "delete",
            icon: "delete",
            type: "button",
            width: "50px",
            onClick: (ids) =>
                productsStore.deleteProduct(ids.clientId, ids.productId),
        },
        {
            name: "Копирование",
            param: "copy",
            icon: "copy",
            type: "button",
            width: "50px",
            onClick: (ids) =>
                productsStore.copyProduct(ids.clientId, ids.productId),
        },
        {
            name: "Название",
            param: "name",
            type: "input",
            isNumber: false,
            width: "200px",
            onEnter: (ids, value) =>
                productsStore.changeProduct(
                    ids.clientId,
                    ids.productId,
                    "name",
                    value,
                    "text",
                    true,
                ),
        },
        {
            name: "Ширина",
            param: "width",
            type: "input",
            isNumber: true,
            width: "100px",
            onEnter: (ids, value) =>
                productsStore.changeProduct(
                    ids.clientId,
                    ids.productId,
                    "width",
                    value,
                    "number",
                    true,
                ),
        },
        {
            name: "Высота",
            param: "height",
            type: "input",
            isNumber: true,
            width: "100px",
            onEnter: (ids, value) =>
                productsStore.changeProduct(
                    ids.clientId,
                    ids.productId,
                    "height",
                    value,
                    "number",
                    true,
                ),
        },
        {
            name: "Глубина",
            param: "depth",
            type: "input",
            isNumber: true,
            width: "100px",
            onEnter: (ids, value) =>
                productsStore.changeProduct(
                    ids.clientId,
                    ids.productId,
                    "depth",
                    value,
                    "number",
                    true,
                ),
        },
        {
            name: "Вес",
            param: "weight",
            type: "input",
            isNumber: true,
            width: "100px",
            onEnter: (ids, value) =>
                productsStore.changeProduct(
                    ids.clientId,
                    ids.productId,
                    "weight",
                    value,
                    "number",
                    true,
                ),
        },
        {
            name: "Кол-во в упаковке",
            param: "count",
            type: "input",
            isNumber: true,
            width: "250px",
            onEnter: (ids, value) =>
                productsStore.changeProduct(
                    ids.clientId,
                    ids.productId,
                    "count",
                    value,
                    "number",
                    true,
                ),
        },
        {
            name: "Объем",
            param: "volume",
            type: "input",
            isNumber: true,
            width: "100px",
            onEnter: (ids, value) =>
                productsStore.changeProduct(
                    ids.clientId,
                    ids.productId,
                    "volume",
                    value,
                    "number",
                    true,
                ),
        },
        {
            name: "Штрих-код",
            param: "qrcode",
            type: "input",
            isNumber: false,
            width: "150px",
            onEnter: (ids, value) =>
                productsStore.changeProduct(
                    ids.clientId,
                    ids.productId,
                    "qrcode",
                    value,
                    "text",
                    true,
                ),
        },
        {
            name: "Категория продукта",
            param: "categoryId",
            type: "select",
            options: getOptions(productsStore.categories),
            width: "200px",
            onSelect: (ids, value) =>
                productsStore.changeProduct(
                    ids.clientId,
                    ids.productId,
                    "categoryId",
                    value,
                    "select",
                    true,
                ),
        },
        {
            name: "Вид упаковки",
            param: "packageTypeId",
            type: "select",
            options: getOptions(productsStore.packageTypes),
            width: "200px",
            onSelect: (ids, value) =>
                productsStore.changeProduct(
                    ids.clientId,
                    ids.productId,
                    "packageTypeId",
                    value,
                    "select",
                    true,
                ),
        },
        {
            name: "Передняя проекция",
            param: "frontProjection",
            type: "upload",
            accept: ".png",
            width: "200px",
            onUpload: async (ids, data) => {
                await productsStore.changeProduct(
                    ids.clientId,
                    ids.productId,
                    "frontProjection",
                    data.original_file.slice(10),
                    "text",
                    true,
                );
            },
        },
    ];

    let data = [];
    let clients = clientsStore.clients;
    for (const clientId in clients) {
        const client = clients[clientId];
        const clientEl = {
            clientId: clientId,
            clientName: client.name,
            clientCreated: client.created,
            clientUpdated: client.updated,
        };

        if (isFiltred(filterStore, clientEl, client)) {
            data.push(clientEl);
            const isClientExtended =
                clientId in extendedClients && extendedClients[clientId];

            const products = productsStore.products[clientId];
            let isSomeProduct = false;
            for (const productId in products) {
                const product = products[productId];
                const productEl = {
                    productId: productId,
                    name: product.name,
                    width: product.width,
                    height: product.height,
                    depth: product.depth,
                    weight: product.weight,
                    count: product.count,
                    volume: product.volume,
                    qrcode: product.qrcode,
                    categoryId: product.categoryId,
                    packageTypeId: product.packageTypeId,
                    frontProjection: product.frontProjection,
                    delete: true,
                    copy: true,
                    productCreated: product.created,
                    productUpdated: product.updated,
                };

                if (isFiltred(filterStore, productEl, product)) {
                    if (isClientExtended) data.push(productEl);
                    isSomeProduct = true;
                }
            }
            if (
                !(filterStore.param in clientEl) &&
                "clientId" in data.at(-1) &&
                filterStore.value != "" &&
                !isSomeProduct
            )
                data.pop();
            else if (isClientExtended)
                data.push({
                    productId: "add",
                });
        }
    }

    useEffect(() => {
        clientsStore.initClients();
        productsStore.initCategories();
        productsStore.initPackageTypes();
        productsStore.getAllProducts();
        filterStore.setFields(header, ["clientCreated", "clientUpdated"]);
    }, []);

    useEffect(() => {
        filterStore.setSelectOptions({
            packageTypeId: getOptions(productsStore.packageTypes),
            categoryId: getOptions(productsStore.categories),
        });
    }, [productsStore.packageTypes, productsStore.categories]);

    return (
        <main>
            <div className={styles.table}>
                <HorizontalTable
                    data={data}
                    header={header}
                    excludedColumns={filterStore.excludedFields}
                />
            </div>
        </main>
    );
}
