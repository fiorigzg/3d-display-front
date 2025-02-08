"use client";

import { useMemo } from "react";
import { useTable } from "react-table";
import html2canvas from "html2canvas";

import { serverUrl } from "constants/main";
import { usePrepackStore } from "store/prepackStore";
import styles from "./page.module.scss";
import Info from "components/Info";
import VerticalSize from "components/VerticalSize";
import VerticalTable from "components/VerticalTable";
import HorizontalTable from "components/HorizontalTable";

const products = {
    1: "Banana",
};

export default function Home() {
    const prepackStore = usePrepackStore();
    const prepackHeader = [
        {
            name: "Количество полок",
            param: null,
            value: prepackStore.shelves.length,
            onEnter: prepackStore.changeShelvesCount,
        },
        { name: "Ширина", param: "width" },
        { name: "Глубина", param: "depth" },
        { name: "Высота боковин", param: "sideHeight" },
        { name: "Толщина боковин", param: "sideThickness" },
        { name: "Толщина задней стенки", param: "backThickness" },
        {
            name: "Толщина передней стенки с учетом бортика",
            param: "frontThickness",
        },
        { name: "Толщина полок", param: "shelfThickness" },
        { name: "Высота фронтона", param: "frontHeight" },
        { name: "Высота топпера над боковинами", param: "topperHeight" },
    ];

    const shelvesHeader = [
        {
            name: "Полка",
            param: "shelfId",
            type: "const",
            width: "80px",
            onSwitchExtend: (id) => console.log("switched", id),
        },
        {
            name: "Ширина",
            param: "width",
            type: "const",
            width: "80px",
        },
        {
            name: "Глубина",
            param: "depth",
            type: "const",
            width: "80px",
        },
        {
            name: "Нагрузка",
            param: "load",
            type: "const",
            width: "80px",
        },
        {
            name: "Количество рядов",
            param: "rowsCount",
            type: "input",
            width: "170px",
        },
        { name: "Ряд", accessor: "rowId", type: "const", width: "50px" },
        {
            name: "Продукт",
            param: "product",
            type: "select",
            options: ["Apple", "Banana", "Orange"],
            width: "170px",
        },
        {
            name: "Отступ слева",
            param: "left",
            type: "input",
            width: "150px",
        },
    ];
    let shelvesData = [];
    for (const shelfId in prepackStore.shelves) {
        const shelf = prepackStore.shelves[shelfId];
        let load = 0;
        shelvesData.push({
            shelfId: shelfId,
            width: prepackStore.width,
            depth: prepackStore.depth,
            load: load,
            rowsCount: Object.keys(shelf.rows).length,
        });

        for (const rowId in shelf.rows) {
            const row = shelf.rows[rowId];
            shelvesData.push({
                rowId: rowId,
                product: products[row.productId],
                left: row.left,
            });
        }
    }

    return (
        <main className={styles.main}>
            <div className={styles.tables} style={{ width: "calc(50% - 1px)" }}>
                <h1>Параметры препака</h1>
                <VerticalTable
                    header={prepackHeader}
                    data={prepackStore}
                    onEnter={prepackStore.changeValue}
                />
                <h1>Параметры полок</h1>
                <div className={styles.tableContainer}>
                    <HorizontalTable
                        header={shelvesHeader}
                        data={shelvesData}
                    />
                </div>
            </div>
            <div className={styles.divider} />
            <div className={styles.ws} style={{ width: "calc(50% - 1px)" }} />
        </main>
    );
}
