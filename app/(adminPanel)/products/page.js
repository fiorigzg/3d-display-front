"use client";

import { useEffect, useState } from "react";
import { Button } from "antd";
import {
    UploadOutlined,
    PlusOutlined,
    DeleteOutlined,
} from "@ant-design/icons";

import styles from "./page.module.scss";
import { serverUrl } from "constants/main";
import { useProductsStore } from "store/productsStore";
import { useClientsStore } from "store/clientsStore";
import { useFilterStore } from "store/filterStore";
import HorizontalTable from "components/HorizontalTable";
import getOptions from "components/getOptions";

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
                if (!(id in extendedClients)) {
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
        };

        if (
            !(filterStore.param in clientEl) ||
            clientEl[filterStore.param].includes(filterStore.value)
        ) {
            data.push(clientEl);

            let products = {};
            if (clientId in extendedClients && extendedClients[clientId])
                products = productsStore.products[clientId];
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
                };

                console.log(productEl[filterStore.param], filterStore.options);
                if (
                    !(filterStore.param in productEl) ||
                    String(productEl[filterStore.param]).includes(
                        filterStore.value,
                    ) ||
                    filterStore.options.includes(productEl[filterStore.param])
                )
                    data.push(productEl);
            }
            if (
                !(filterStore.param in clientEl) &&
                "clientId" in data.at(-1) &&
                filterStore.value != ""
            )
                data.pop();
            else if (clientId in extendedClients && extendedClients[clientId])
                data.push({
                    productId: "add",
                });
        }
    }

    useEffect(() => {
        clientsStore.initClients();
        productsStore.initCategories();
        productsStore.initPackageTypes();
        filterStore.setFields(header);
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
                <HorizontalTable data={data} header={header} />
            </div>
        </main>
    );
}
