"use client";

import { useEffect, useState } from "react";

import { usePrepackStore } from "store/prepackStore";
import { useProductsStore } from "store/productsStore";
import styles from "./page.module.scss";
import VerticalTable from "components/VerticalTable";
import HorizontalTable from "components/HorizontalTable";
import Prepack from "components/Prepack";
import VerticalDivider from "components/VerticalDivider";

export default function Home() {
  const prepackStore = usePrepackStore();
  const productsStore = useProductsStore();
  const [queryParams, setQueryParams] = useState({
    id: null,
    clientId: null,
  });
  const [scale, setScale] = useState(0.4);
  const [dividerLeft, setDividerLeft] = useState(70);

  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);

    let newQueryParams = {
      id: Number(urlParams.get("id")),
      clientId: Number(urlParams.get("clientId")),
    };
    setQueryParams(newQueryParams);
    if (newQueryParams.clientId != null) {
      productsStore.initProducts(newQueryParams.clientId);
    }
    if (newQueryParams.id != null) {
      prepackStore.initAll(newQueryParams.id);
    }
  }, []);

  if (prepackStore.step == "load" || productsStore.products[queryParams.clientId] == undefined) {
    return (
      <div className={styles.main}>
        <div className={styles.loadingContainer}>
          <div className={styles.loadingIndicator}>
            <div className={styles.spinner}></div>
          </div>
        </div>
      </div>
    );
  }

  let products = [];
  if (
    queryParams.clientId != null &&
    queryParams.clientId in productsStore.products
  ) {
    products = productsStore.products[queryParams.clientId];
  }
  let productOptions = {};
  for (const productId in products) {
    productOptions[productId] = products[productId].name;
  }

  const prepackHeader = [
    {
      name: "Клиент",
      param: "clientName",
      isConst: true,
    },
    {
      name: "Проект",
      param: "projectName",
      isConst: true,
    },
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
    {
      name: "Высота короба",
      param: null,
      value: prepackStore.boxSizes.height,
      onEnter: (value) => prepackStore.changeBoxSizes("height", value),
    },
    {
      name: "Ширина короба",
      param: null,
      value: prepackStore.boxSizes.width,
      onEnter: (value) => prepackStore.changeBoxSizes("width", value),
    },
    {
      name: "Глубина короба",
      param: null,
      value: prepackStore.boxSizes.depth,
      onEnter: (value) => prepackStore.changeBoxSizes("depth", value),
    },
  ];
  const shelvesHeader = [
    {
      name: "Полка",
      param: "shelfId",
      type: "id",
      width: "100px",
    },
    {
      name: "Номер полки",
      param: "shelfNumber",
      type: "const",
      width: "80px",
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
      width: "130px",
      onEnter: (ids, value) => prepackStore.changeShelf(ids, "margin", value),
    },
    {
      name: "Мин. расстояние до краев рабочего поля",
      param: "padding",
      type: "input",
      isNumber: true,
      width: "180px",
      onEnter: (ids, value) => prepackStore.changeShelf(ids, "padding", value),
    },
    {
      name: "Кол-во рядов",
      param: "rowsCount",
      type: "input",
      isNumber: true,
      width: "80px",
      onEnter: (ids, value) =>
        prepackStore.changeRowsCount(ids, value, Object.keys(products)[0]),
    },
    { name: "Ряд", accessor: "rowId", type: "id", width: "100px" },
    {
      name: "Продукт",
      param: "product",
      type: "select",
      options: productOptions,
      onSelect: (ids, value) => prepackStore.changeRow(ids, "productId", value),
      width: "170px",
    },
    {
      name: "Отступ слева",
      param: "left",
      type: "input",
      isNumber: true,
      onEnter: (ids, value) => prepackStore.changeRow(ids, "left", value),
      width: "80px",
    },
    {
      name: "Кол-во продуктов",
      param: "count",
      type: "input",
      isNumber: true,
      onEnter: (ids, value) => prepackStore.changeRow(ids, "count", value),
      width: "100px",
    },
    {
      name: "Отступ между",
      param: "between",
      type: "input",
      isNumber: true,
      onEnter: (ids, value) => prepackStore.changeRow(ids, "between", value),
      width: "100px",
    },
    {
      name: "Проектировать",
      type: "button",
      icon: "next",
      param: "makeShelf",
      width: "50px",
      onClick: (ids) =>
        prepackStore.makeShelf(ids, products, queryParams.clientId),
    },
    {
      name: "Обновить",
      type: "button",
      icon: "update",
      param: "updateShelf",
      width: "50px",
      onClick: (ids) => prepackStore.updateShelfJson(ids),
    },
    {
      name: "Сброс к рядам",
      type: "button",
      icon: "clear",
      param: "toRows",
      width: "50px",
      onClick: (ids) => prepackStore.changeShelf(ids, "isRows", true),
    },
    {
      name: "Удаление",
      type: "button",
      icon: "delete",
      param: "deleteRow",
      width: "50px",
      onClick: (ids) => prepackStore.deleteRow(ids),
    },
  ];

  let shelvesData = [];
  let shelfNumber = 0;

  for (const shelfId in prepackStore.shelves) {
    const shelf = prepackStore.shelves[shelfId];
    shelfNumber++;
    let shelfEl = {
      shelfId: shelfId,
      width:
        prepackStore.width - prepackStore.sideThickness * 2 - shelf.padding * 2,
      depth:
        prepackStore.depth -
        prepackStore.backThickness -
        prepackStore.frontThickness -
        shelf.padding * 2,
      load: 0,
      margin: shelf.margin,
      padding: shelf.padding,
      rowsCount: Object.keys(shelf.rows).length,
      makeShelf: true,
      updateShelf: !shelf.isRows,
      toRows: !shelf.isRows,
      shelfNumber: shelfNumber,
      uniqueId: `shelf-${shelfId}`,
      children: [],
    };

    let shelfLoad = 0;
    if (shelf.isRows) {
      for (const rowId in shelf.rows) {
        const rowEl = shelf.rows[rowId];
        console.log(rowEl.productId, productsStore.products[queryParams.clientId])
        const productEl =
          productsStore.products[queryParams.clientId][rowEl.productId];
        let productsCount = rowEl.count || rowEl.count;

        if (productEl != undefined) {
          if (productsCount == 0) {
            productsCount = Math.floor(
              (prepackStore.depth -
                prepackStore.backThickness -
                prepackStore.frontThickness -
                shelf.padding * 2 +
                rowEl.between) /
                (Math.max(productEl.depth, 1) + rowEl.between),
            );
          }
          shelfLoad += productEl.weight * productsCount;
        }

        shelfEl.children.push({
          rowId: rowId,
          product: rowEl.productId,
          left: rowEl.left,
          count: productsCount,
          deleteRow: true,
          between: rowEl.between,
          uniqueId: `row-${rowId}`,
        });
      }
    } else {
      if ("elems" in shelf.json) {
        for (const elem of shelf.json.elems) {
          const product =
            productsStore.products[queryParams.clientId][elem.productId];
          shelfLoad += product.weight;
        }
      }
    }

    shelfEl.load = shelfLoad;

    shelvesData.push(shelfEl);
  }

  return (
    <main className={styles.main}>
      <div className={styles.tables} style={{ width: `calc(${dividerLeft}% - 20px)` }}>
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
            name={`shelves-${prepackStore.id}`}
            header={shelvesHeader}
            headerHeight="60px"
            data={shelvesData}
            excludedColumns={[]}
            loadingText={"Добавить полки можно в параметрах препака"}
          />
        </div>
      </div>
      <VerticalDivider
        left={dividerLeft}
        setLeft={setDividerLeft}
        buttons={[
          {
            text: "Сохранить",
            onClick: () => {
              prepackStore.saveAll();
            },
          },
          {
            text: "Отчет",
            onClick: () => {
              window.open(
                `/doc?id=${prepackStore.id}&clientId=${queryParams.clientId}`,
              );
            },
          },
        ]}
      />
      <div
        className={styles.ws}
        style={{ width: `calc(${100 - dividerLeft}% - 1px)` }}
        onWheel={(e) => {
          setScale(
            scale + (e.deltaY < 0 ? 0.05 * (scale < 1) : -0.05 * (scale > 0.1)),
          );
        }}
      >
        <Prepack
          prepackStore={prepackStore}
          scale={scale}
          clientProducts={productsStore.products[queryParams.clientId]}
          mainColor="#cf6249"
        />
      </div>
    </main>
  );
}
