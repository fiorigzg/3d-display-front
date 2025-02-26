"use client";

import { useEffect } from "react";

import { serverUrl } from "constants/main";
import styles from "./page.module.scss";
import { useProductsStore } from "store/productsStore";
import { useFilterStore } from "store/filterStore";
import HorizontalTable from "components/HorizontalTable";

export default function Home() {
    const productsStore = useProductsStore();
    const filterStore = useFilterStore();

    const header = [
        {
            name: "Тип упаковки",
            param: "id",
            type: "id",
            width: "100px",
            onAdd: (ids) => productsStore.createPackageType(),
        },
        {
            name: "Удаление",
            type: "button",
            icon: "delete",
            param: "delete",
            width: "50px",
            onClick: (ids) => productsStore.deletePackageType(ids.id),
        },
        {
            name: "Копирование",
            type: "button",
            icon: "copy",
            param: "copy",
            width: "50px",
            onClick: (ids) => productsStore.copyPackageType(ids.id),
        },
        {
            name: "Объект товара",
            type: "upload",
            param: "object",
            width: "calc(50% - 100px)",
            minWidth: "300px",
            accept: ".obj",
            onUpload: async (ids, data) => {
                await productsStore.putPackageType(
                    ids.id,
                    {
                        frontSvg: data.front_svg_file,
                        sideSvg: data.side_svg_file,
                        topSvg: data.top_svg_file,
                        object: data.original_file.slice(10),
                    },
                    true,
                );
            },
        },
        {
            name: "Название",
            param: "name",
            type: "input",
            isNumber: false,
            width: "calc(50% - 100px)",
            minWidth: "300px",
            onEnter: (ids, value) =>
                productsStore.changePackageType(
                    ids.id,
                    "name",
                    value,
                    "text",
                    true,
                ),
        },
    ];

    let data = [];
    for (const packageTypeId in productsStore.packageTypes) {
        const packageType = productsStore.packageTypes[packageTypeId];
        let dataEl = {
            id: packageTypeId,
            name: packageType.name,
            object: packageType.object,
            delete: true,
            copy: true,
        };

        if (String(dataEl[filterStore.param]).includes(filterStore.value))
            data.push(dataEl);
    }
    data.push({
        id: "add",
    });

    useEffect(() => {
        productsStore.initPackageTypes();
        filterStore.setFields(header);
    }, []);

    return (
        <main>
            <div className={styles.table}>
                <HorizontalTable data={data} header={header} />
            </div>
        </main>
    );
}
