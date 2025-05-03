"use client";

import { useEffect, useRef, useState } from "react";
import { toPng } from "html-to-image";
import cx from "classnames";

import { usePrepackStore } from "store/prepackStore";
import { useProductsStore } from "store/productsStore";
import styles from "./page.module.scss";
import VerticalDivider from "components/VerticalDivider";
import Prepack from "components/Prepack";
import TopShelf from "components/TopShelf";
import FrontShelf from "components/FrontShelf";
import { jsonFromRows } from "api/prepackApi";

export default function Home() {
  const prepackStore = usePrepackStore();
  const productsStore = useProductsStore();
  const [queryParams, setQueryParams] = useState({
    id: null,
    clientId: null,
  });
  const [scale, setScale] = useState(0.5);
  const [dividerLeft, setDividerLeft] = useState(30);

  const calculateScale = () => {
    setScale(
      (Math.min(window.innerWidth, 1550) * 0.9 - 600) /
        (4 * prepackStore.width),
    );
  };

  async function takeScreenshot(after) {
    try {
      const element = document.body;

      const exportButton = document.querySelector("#export-btn");
      exportButton.style.display = "none";

      const dataUrl = await toPng(element, {
        width: element.scrollWidth,
        height: element.scrollHeight,
        style: {
          transform: "none",
          transformOrigin: "top left",
        },
      });

      exportButton.style.display = "block";

      const image = new Image();
      image.src = dataUrl;
      image.onload = () => after(image);
    } catch (error) {
      console.error("Failed to capture screenshot:", error);
    }
  }

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
    calculateScale();
    window.addEventListener("resize", calculateScale);
  }, []);

  if (prepackStore.step == "load") {
    return (
      <div className={styles.main}>
        <p className={styles.load}>Загрузка...</p>
      </div>
    );
  }

  let rowsArr = [];
  let shelfNumber = 1;
  for (const shelfId in prepackStore.shelves) {
    const shelf = prepackStore.shelves[shelfId];
    let shelfWeight = 0,
      shelfProducts = {};

    if (shelf.isRows) {
      jsonFromRows(
        productsStore.products[queryParams.clientId],
        prepackStore,
        shelfId,
      );
    }

    if ("elems" in shelf.json) {
      for (const elem of shelf.json.elems) {
        const product =
          productsStore.products[queryParams.clientId][elem.productId];

        if (product != undefined) {
          shelfWeight += product.weight;

          if (!(elem.productId in shelfProducts)) {
            shelfProducts[elem.productId] = {
              name: product.name,
              weight: product.weight,
              count: 1,
            };
          } else {
            shelfProducts[elem.productId].count++;
          }
        }
      }
    }

    rowsArr.push(
      <div className={styles.row} key={shelfId}>
        <div className={styles.column}>
          <h1>
            Полка {shelfNumber} - {shelfWeight} г.
          </h1>
          <TopShelf
            prepackStore={prepackStore}
            id={shelfId}
            scale={scale}
            clientProducts={productsStore.products[queryParams.clientId]}
          />
        </div>
        <div className={styles.column}>
          <FrontShelf
            prepackStore={prepackStore}
            id={shelfId}
            scale={scale}
            clientProducts={productsStore.products[queryParams.clientId]}
          />
        </div>
        <div
          className={cx(styles.column, styles.info)}
          style={{ width: `${500 * scale}px` }}
        >
          {Object.keys(shelfProducts).map((id) => (
            <div className={styles.product} key={id}>
              <p>{shelfProducts[id].name}</p>
              <p>{shelfProducts[id].count}</p>
            </div>
          ))}
        </div>
      </div>,
    );

    shelfNumber++;
  }

  return (
    <main className={styles.main}>
      <div className={styles.header}>
        <h1>{`${prepackStore.clientName} - ${prepackStore.projectName} - ${prepackStore.name}`}</h1>
      </div>
      <div id="docContainer" className={styles.doc}>
        <div className={styles.prepack} style={{ width: `${dividerLeft}%` }}>
          <div className={styles.container}>
            <Prepack
              prepackStore={prepackStore}
              scale={scale}
              clientProducts={productsStore.products[queryParams.clientId]}
            />
          </div>
          <div className={styles.info}>
            <p>
              Размеры препака:{" "}
              {prepackStore.sideHeight + prepackStore.frontonHeight}x
              {prepackStore.width}x{prepackStore.depth}
            </p>
            <p>
              Размеры короба: {prepackStore.boxSizes.width}x
              {prepackStore.boxSizes.height}x{prepackStore.boxSizes.depth}
            </p>
          </div>
        </div>
        <VerticalDivider
          left={dividerLeft}
          setLeft={setDividerLeft}
          buttons={[
            {
              text: "Экспорт JPG",
              id: "export-btn",
              onClick: () => {
                takeScreenshot((image) => {
                  const link = document.createElement("a");
                  link.href = image.src;
                  link.download = "screenshot.jpg";
                  link.click();
                });
              },
            },
          ]}
        />
        <div
          className={styles.shelves}
          style={{ width: `calc(${100 - dividerLeft}% - 1px)` }}
        >
          {rowsArr}
        </div>
      </div>
    </main>
  );
}
