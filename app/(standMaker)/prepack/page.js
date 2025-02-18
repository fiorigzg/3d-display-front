"use client";

import { useEffect, useRef, useState } from "react";
import html2canvas from "html2canvas";

import { serverUrl } from "constants/main";
import { usePrepackStore } from "store/prepackStore";
import { useProductsStore } from "store/productsStore";
import styles from "./page.module.scss";
import Info from "components/Info";
import VerticalSize from "components/VerticalSize";
import VerticalTable from "components/VerticalTable";
import HorizontalTable from "components/HorizontalTable";

export default function Home() {
    const prepackStore = usePrepackStore();
    const productsStore = useProductsStore();
    const prepackContainerRef = useRef(null);
    const [queryParams, setQueryParams] = useState({
        id: null,
        clientId: null,
    });

    useEffect(() => {
        const urlParams = new URLSearchParams(window.location.search);

        setQueryParams({
            id: Number(urlParams.get("id")),
            clientId: Number(urlParams.get("clientId")),
        });
    }, []);
    useEffect(() => {
        if (queryParams.clientId != null)
            productsStore.initProducts(queryParams.clientId);
        if (queryParams.id != null) prepackStore.initAll(queryParams.id);
    }, [queryParams]);

    if (prepackStore.step == "load")
        return (
            <div className={styles.main}>
                <p className={styles.load}>Загрузка...</p>
            </div>
        );

    let products = [];
    if (
        queryParams.clientId != null &&
        queryParams.clientId in productsStore.products
    )
        products = productsStore.products[queryParams.clientId];

    let productOptions = {};
    for (const productId in products) {
        const product = products[productId];
        productOptions[productId] = product.name;
    }

    const prepackHeader = [
        {
            name: "Количество полок",
            param: null,
            value: Object.keys(prepackStore.shelves).length,
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
        { name: "Высота фронтона", param: "frontonHeight" },
        { name: "Высота топпера над боковинами", param: "topperHeight" },
    ];
    const shelvesHeader = [
        {
            name: "Полка",
            param: "shelfId",
            type: "id",
            width: "80px",
            onSwitchExtend: (id) =>
                prepackStore.switchShelfExtend(id, "isExtended"),
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
            name: "Межполочное расстояние",
            param: "margin",
            type: "input",
            isNumber: true,
            width: "170px",
            onEnter: (ids, value) =>
                prepackStore.changeShelf(ids, "margin", value),
        },
        {
            name: "Мин. расстояние до краев рабочего поля",
            param: "padding",
            type: "input",
            isNumber: true,
            width: "170px",
            onEnter: (ids, value) =>
                prepackStore.changeShelf(ids, "padding", value),
        },
        {
            name: "Количество рядов",
            param: "rowsCount",
            type: "input",
            isNumber: true,
            width: "170px",
            onEnter: (ids, value) =>
                prepackStore.changeRowsCount(
                    ids,
                    value,
                    Object.keys(products)[0],
                ),
        },
        { name: "Ряд", accessor: "rowId", type: "id", width: "50px" },
        {
            name: "Продукт",
            param: "product",
            type: "select",
            options: productOptions,
            onSelect: (ids, value) =>
                prepackStore.changeRow(ids, "productId", value),
            width: "170px",
        },
        {
            name: "Отступ слева",
            param: "left",
            type: "input",
            isNumber: true,
            onEnter: (ids, value) => prepackStore.changeRow(ids, "left", value),
            width: "150px",
        },
        {
            name: "Проектировать",
            type: "button",
            param: "makeShelf",
            width: "130px",
            onClick: (ids) => prepackStore.makeShelf(ids, products),
        },
        {
            name: "Обновить",
            type: "button",
            param: "updateShelf",
            width: "90px",
            onClick: (ids) => prepackStore.updateShelfJson(ids),
        },
        {
            name: "Сброс к рядам",
            type: "button",
            param: "toRows",
            width: "120px",
            onClick: (ids) => prepackStore.changeShelf(ids, "isRows", true),
        },
    ];
    let shelvesData = [];
    for (const shelfId in prepackStore.shelves) {
        const shelf = prepackStore.shelves[shelfId];
        let load = 0;
        shelvesData.push({
            shelfId: shelfId,
            width:
                prepackStore.width -
                prepackStore.sideThickness * 2 -
                shelf.padding * 2,
            depth:
                prepackStore.depth -
                prepackStore.backThickness -
                prepackStore.frontThickness -
                shelf.padding * 2,
            load: load,
            margin: shelf.margin,
            padding: shelf.padding,
            rowsCount: Object.keys(shelf.rows).length,
            makeShelf: true,
            updateShelf: !shelf.isRows,
            toRows: !shelf.isRows,
        });

        if (shelf.isExtended) {
            for (const rowId in shelf.rows) {
                const row = shelf.rows[rowId];
                shelvesData.push({
                    rowId: rowId,
                    product: row.productId,
                    left: row.left,
                });
            }
        }
    }

    let forSizes = { firstShelfMaxProduct: 0 };
    const scale = prepackStore.scale;
    let shelvesArr = [];
    let shelfTop = prepackStore.frontonHeight;
    let isFirstShelf = true;
    for (const shelfId in prepackStore.shelves) {
        const shelf = prepackStore.shelves[shelfId];
        shelfTop += shelf.margin;

        let productsArr = [];
        let standsArr = [];
        let partitionsArr = [];
        if (shelf.isRows) {
            let productLeft = shelf.padding;
            for (const rowId in shelf.rows) {
                const row = shelf.rows[rowId];
                const product = products[row.productId];
                if (product != undefined) {
                    productLeft += row.left;

                    productsArr.push(
                        <img
                            className={styles.image}
                            src={`${serverUrl}/loadfile/${product.frontProjection}`}
                            style={{
                                width: `${product.width * scale}px`,
                                height: `${product.height * scale}px`,
                                left: `${productLeft * scale}px`,
                                bottom: `${prepackStore.shelfThickness * scale + 1}px`,
                            }}
                        />,
                    );

                    if (isFirstShelf)
                        forSizes.firstShelfMaxProduct = Math.max(
                            forSizes.firstShelfMaxProduct,
                            product.height,
                        );
                    productLeft += product.width;
                }
            }
        } else {
            if ("elems" in shelf.json) {
                console.log(shelf.json);
                for (const elem of shelf.json.elems) {
                    const product = products[elem.productId];

                    if (product != undefined)
                        productsArr.push(
                            <img
                                className={styles.image}
                                src={`${serverUrl}/loadfile/${product.frontProjection}`}
                                style={{
                                    width: `${product.width * scale}px`,
                                    height: `${product.height * scale}px`,
                                    left: `${(elem.x + shelf.padding) * scale}px`,
                                    bottom: `${(elem.z + prepackStore.shelfThickness) * scale + 1}px`,
                                }}
                            />,
                        );

                    if (isFirstShelf)
                        forSizes.firstShelfMaxProduct = Math.max(
                            forSizes.firstShelfMaxProduct,
                            product.height + elem.z,
                        );
                }
            }

            if ("inserts" in shelf.json) {
                for (const stand of shelf.json.inserts) {
                    standsArr.push(
                        <div
                            className={styles.stand}
                            style={{
                                width: `${stand.width * scale}px`,
                                height: `${stand.height * scale}px`,
                                left: `${(stand.x + shelf.padding) * scale}px`,
                                bottom: `${(stand.z + prepackStore.shelfThickness) * scale + 1}px`,
                            }}
                        />,
                    );
                }
            }

            if ("partition" in shelf.json) {
                for (const partition of shelf.json.partitions) {
                    standsArr.push(
                        <div
                            className={styles.partition}
                            style={{
                                width: `${partition.width * scale}px`,
                                height: `${partition.height * scale}px`,
                                left: `${(partition.x + shelf.padding) * scale}px`,
                                bottom: `${(partition.z + prepackStore.shelfThickness) * scale + 1}px`,
                            }}
                        />,
                    );
                }
            }
        }

        shelvesArr.push(
            <div
                className={styles.box}
                style={{
                    width: `${(prepackStore.width - prepackStore.sideThickness * 2) * scale - 2}px`,
                    height: `${prepackStore.shelfThickness * scale}px`,
                    left: `${prepackStore.sideThickness * scale}px`,
                    top: `${shelfTop * scale - 2 + isFirstShelf}px`,
                }}
            >
                {productsArr}
                {standsArr}
                {partitionsArr}
            </div>,
        );

        if (isFirstShelf) isFirstShelf = false;
        shelfTop += prepackStore.shelfThickness;
    }

    let sizesArr = [];
    if (Object.keys(prepackStore.shelves).length == 0)
        forSizes.firstShelfTop = 0;
    else
        forSizes.firstShelfTop =
            prepackStore.shelves[Object.keys(prepackStore.shelves)[0]].margin;
    forSizes.frontonHeight = prepackStore.frontonHeight;
    forSizes.sideHeight = prepackStore.sideHeight;
    forSizes.prepackHeight = forSizes.sideHeight + forSizes.frontonHeight;
    forSizes.lastShelfTop = shelfTop;
    forSizes.lastShelfBottom = forSizes.prepackHeight - forSizes.lastShelfTop;
    forSizes.firstShelfProductTop =
        forSizes.frontonHeight +
        forSizes.firstShelfTop -
        forSizes.firstShelfMaxProduct;

    sizesArr.push(
        <VerticalSize
            value={forSizes.firstShelfProductTop}
            height={forSizes.firstShelfProductTop * scale - 2}
            left={-20}
            top={0}
        />,
        <VerticalSize
            value={forSizes.lastShelfBottom}
            height={forSizes.lastShelfBottom * scale - 2}
            left={-20}
            top={forSizes.lastShelfTop * scale + 2}
        />,
        <VerticalSize
            value={forSizes.frontonHeight}
            height={forSizes.frontonHeight * scale - 2}
            left={-40}
            top={0}
        />,
        <VerticalSize
            value={forSizes.sideHeight}
            height={forSizes.sideHeight * scale - 2}
            left={-40}
            top={forSizes.frontonHeight * scale + 2}
        />,
        <VerticalSize
            value={forSizes.prepackHeight}
            height={forSizes.prepackHeight * scale - 2}
            left={-60}
            top={0}
        />,
    );

    return (
        <main className={styles.main}>
            <div className={styles.tables} style={{ width: "50%" }}>
                <h1>Параметры препака</h1>
                <div className={styles.prepackTableContainer}>
                    <VerticalTable
                        header={prepackHeader}
                        data={prepackStore}
                        onEnter={prepackStore.changePepack}
                    />
                </div>
                <h1>Параметры полок</h1>
                <div className={styles.shelvesTableContainer}>
                    <HorizontalTable
                        header={shelvesHeader}
                        data={shelvesData}
                    />
                </div>
            </div>
            <div className={styles.divider}>
                <button
                    className={styles.stepBtn}
                    onClick={() => {
                        html2canvas(prepackContainerRef.current, {
                            useCORS: true,
                            allowTaint: true,
                        }).then((canvas) => {
                            const dataUrl = canvas.toDataURL("image/png");
                            prepackStore.sendPrepackImage(dataUrl);
                        });
                    }}
                >
                    Завершить
                </button>
            </div>
            <div
                className={styles.ws}
                style={{ width: "calc(50% - 1px)" }}
                onWheel={(e) => {
                    prepackStore.addScale(e.deltaY < 0);
                }}
            >
                <div
                    className={styles.prepackContainer}
                    ref={prepackContainerRef}
                >
                    <div
                        className={styles.prepack}
                        style={{
                            width: `${prepackStore.width * scale}px`,
                            height: `${(prepackStore.sideHeight + prepackStore.frontonHeight) * scale}px`,
                            borderRadius: `${30 * scale}px ${30 * scale}px 0 0`,
                        }}
                    >
                        <div
                            className={styles.box}
                            style={{
                                width: `${prepackStore.sideThickness * scale}px`,
                                height: `${prepackStore.sideHeight * scale}px`,
                                bottom: "-1px",
                                left: `-1px`,
                            }}
                        />
                        <div
                            className={styles.box}
                            style={{
                                width: `${prepackStore.sideThickness * scale}px`,
                                height: `${prepackStore.sideHeight * scale}px`,
                                bottom: "-1px",
                                right: `-1px`,
                            }}
                        />
                        {shelvesArr}
                        {sizesArr}
                    </div>
                </div>
            </div>
        </main>
    );
}
