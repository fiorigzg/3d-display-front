"use client";

import { useEffect, useRef, useState } from "react";
import html2canvas from "html2canvas";

import { serverUrl } from "constants/main";
import { usePrepackStore } from "store/prepackStore";
import { useProductsStore } from "store/productsStore";
import styles from "./page.module.scss";
import Info from "components/Info";
import VerticalSize from "components/VerticalSize";
import HorizontalSize from "components/HorizontalSize";
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
  const [dividerLeft, setDividerLeft] = useState(50);
  const [isDividerDragging, setIsDividerDragging] = useState(false);
  console.log(prepackStore)

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
  useEffect(() => {
    const handleMouseMove = (e) => {
      if (isDividerDragging) {
        const newPos = (e.clientX / window.innerWidth) * 100;
        setDividerLeft(Math.min(Math.max(newPos, 10), 90));
      }
    };

    const handleMouseUp = () => {
      setIsDividerDragging(false);
    };

    if (isDividerDragging) {
      window.addEventListener("mousemove", handleMouseMove);
      window.addEventListener("mouseup", handleMouseUp);
    } else {
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("mouseup", handleMouseUp);
    }

    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("mouseup", handleMouseUp);
    };
  }, [isDividerDragging]);
  const handleMouseDown = () => {
    setIsDividerDragging(true);
  };

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
      name: "Клиент",
      param: "clientName",
      isConst: true,
    }, {
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
      onEnter: (ids, value) =>
        prepackStore.changeShelf(ids, "margin", value),
    },
    {
      name: "Мин. расстояние до краев рабочего поля",
      param: "padding",
      type: "input",
      isNumber: true,
      width: "180px",
      onEnter: (ids, value) =>
        prepackStore.changeShelf(ids, "padding", value),
    },
    {
      name: "Кол-во рядов",
      param: "rowsCount",
      type: "input",
      isNumber: true,
      width: "80px",
      onEnter: (ids, value) =>
        prepackStore.changeRowsCount(
          ids,
          value,
          Object.keys(products)[0],
        ),
    },
    { name: "Ряд", accessor: "rowId", type: "id", width: "100px" },
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
  let forSizes = { firstShelfMaxProduct: 0 };
  const scale = prepackStore.scale;
  let shelvesArr = [];
  let shelfTop = prepackStore.frontonHeight;
  let isFirstShelf = true;
  let shelfNumber = 0;

  for (const shelfId in prepackStore.shelves) {
    const shelf = prepackStore.shelves[shelfId];
    shelfNumber++;
    let shelfEl = {
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

    shelfTop += shelf.margin;
    let productsArr = [];
    let standsArr = [];
    let partitionsArr = [];
    let shelfLoad = 0;
    if (shelf.isRows) {
      let productLeft = shelf.padding;

      for (const rowId in shelf.rows) {
        const rowEl = shelf.rows[rowId];
        const productEl = products[rowEl.productId];
        let productsCount = rowEl.count || rowEl.count;

        if (productEl != undefined) {
          productLeft += rowEl.left;
          if (productsCount == 0) {
            productsCount = Math.floor(
              (
                (
                  prepackStore.depth -
                  prepackStore.backThickness -
                  prepackStore.frontThickness -
                  shelf.padding * 2
                ) + rowEl.between
              ) / (
                Math.max(productEl.depth, 1) + rowEl.between
              )
            );
          }
          shelfLoad += productEl.weight * productsCount;

          productsArr.push(
            productEl.frontProjection == "" ? (
              <div
                className={styles.product}
                style={{
                  width: `${productEl.width * scale - 2}px`,
                  height: `${productEl.height * scale - 4}px`,
                  left: `${productLeft * scale}px`,
                  bottom: `${prepackStore.shelfThickness * scale + 1}px`,
                }}
              />
            ) : (
              <img
                className={styles.image}
                src={`${serverUrl}/loadfile/${productEl.frontProjection}`}
                style={{
                  width: `${productEl.width * scale - 2}px`,
                  height: `${productEl.height * scale - 4}px`,
                  left: `${productLeft * scale}px`,
                  bottom: `${prepackStore.shelfThickness * scale + 1}px`,
                }}
              />
            ),
          );

          if (isFirstShelf)
            forSizes.firstShelfMaxProduct = Math.max(
              forSizes.firstShelfMaxProduct,
              productEl.height,
            );
          productLeft += productEl.width;
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
          const product = products[elem.productId];
          shelfLoad += product.weight;

          if (product != undefined)
            productsArr.push(
              product.frontProjection == "" ? (
                <div
                  className={styles.product}
                  style={{
                    width: `${product.width * scale - 2}px`,
                    height: `${product.height * scale - 4}px`,
                    left: `${(elem.x + shelf.padding) * scale}px`,
                    bottom: `${(elem.z + prepackStore.shelfThickness) * scale + 1}px`,
                  }}
                />
              ) : (
                <img
                  className={styles.image}
                  src={`${serverUrl}/loadfile/${product.frontProjection}`}
                  style={{
                    width: `${product.width * scale - 2}px`,
                    height: `${product.height * scale - 4}px`,
                    left: `${(elem.x + shelf.padding) * scale}px`,
                    bottom: `${(elem.z + prepackStore.shelfThickness) * scale + 1}px`,
                  }}
                />,
                            )
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
                width: `${stand.width * scale - 3}px`,
                height: `${stand.height * scale - 6}px`,
                left: `${(stand.x + shelf.padding) * scale}px`,
                bottom: `${(stand.z + prepackStore.shelfThickness) * scale + 1}px`,
              }}
            />,
          );
        }
      }

      if ("partitions" in shelf.json) {
        for (const partition of shelf.json.partitions) {
          partitionsArr.push(
            <div
              className={styles.partition}
              style={{
                width: `${partition.width * scale - 3}px`,
                height: `${partition.height * scale - 6}px`,
                left: `${(partition.x + shelf.padding) * scale}px`,
                bottom: `${(partition.z + prepackStore.shelfThickness) * scale + 1}px`,
              }}
            />,
          );
        }
      }
    }

    shelfEl.load = shelfLoad;

    shelvesData.push(shelfEl);
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
  forSizes.shelfWidth = prepackStore.width - prepackStore.sideThickness * 2;
  forSizes.prepackWidth = prepackStore.width;

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

  sizesArr.push(
    <HorizontalSize
      value={forSizes.shelfWidth}
      width={forSizes.shelfWidth * scale}
      bottom={-25}
      left={prepackStore.sideThickness * scale}
    />,
    <HorizontalSize
      value={forSizes.prepackWidth}
      width={forSizes.prepackWidth * scale}
      bottom={-45}
      left={0}
    />,
  );

  return (
    <main className={styles.main}>
      <div className={styles.tables} style={{ width: `${dividerLeft}%` }}>
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
            className={styles.shelvesTable}
            header={shelvesHeader}
            headerHeight="60px"
            data={shelvesData}
            excludedColumns={[]}
          />
        </div>
      </div>
      <div className={styles.divider} onMouseDown={handleMouseDown}>
        <button className={styles.saveBtn} onClick={() => {
          prepackStore.saveAll();
        }}>
          Сохранить
        </button>
        <button
          className={styles.stepBtn}
          onClick={() => {
            html2canvas(prepackContainerRef.current, {
              logging: true,
              letterRendering: 1,
              allowTaint: false,
              useCORS: true,
            }).then((canvas) => {
              const dataUrl = canvas.toDataURL("image/png");
              prepackStore.sendPrepackImage(dataUrl);
            });
          }}
        >
          Сделать отчет
        </button>
      </div>
      <div
        className={styles.ws}
        style={{ width: `calc(${100 - dividerLeft}% - 1px)` }}
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
