"use client";

import { useEffect, useRef, useState } from "react";
import { toPng } from "html-to-image";
import jsPDF from "jspdf";

import { usePrepackStore } from "store/prepackStore";
import { useProductsStore } from "store/productsStore";
import styles from "./page.module.scss";
import VerticalTable from "components/VerticalTable";
import HorizontalTable from "components/HorizontalTable";
import VerticalDivider from "components/VerticalDivider";
import Prepack from "components/Prepack";
import TopShelf from "components/TopShelf";
import FrontShelf from "components/FrontShelf";
import { jsonFromRows } from "api/prepackApi";
import cx from "classnames";

export default function Home() {
  const prepackStore = usePrepackStore();
  const productsStore = useProductsStore();
  const [queryParams, setQueryParams] = useState({
    id: null,
    clientId: null,
  });
  const [prepackScale, setPrepackScale] = useState(0.4);
  const [shelvesScale, setShelvesScale] = useState(0.4);
  const [dividerLeft, setDividerLeft] = useState(30);

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

  async function takeScreenshot(after) {
    try {
      const element = document.documentElement;
      const printButton = document.querySelector("#print-btn");
      const exportButton = document.querySelector("#export-btn");

      printButton.style.display = "none";
      exportButton.style.display = "none";

      const dataUrl = await toPng(element);

      printButton.style.display = "block";
      exportButton.style.display = "block";

      const image = new Image();
      image.src = dataUrl;
      image.onload = () => after(image);
    } catch (error) {
      console.error("Failed to capture screenshot:", error);
    }
  }

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
            scale={shelvesScale}
            clientProducts={productsStore.products[queryParams.clientId]}
          />
        </div>

        <FrontShelf
          prepackStore={prepackStore}
          id={shelfId}
          scale={shelvesScale}
          clientProducts={productsStore.products[queryParams.clientId]}
        />
        <div className={cx(styles.column, styles.info)}>
          {Object.keys(shelfProducts).map((id) => (
            <p key={id}>
              {shelfProducts[id].name} - {shelfProducts[id].count} x{" "}
              {shelfProducts[id].weight} г.
            </p>
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
      <div className={styles.doc}>
        <div
          className={styles.prepack}
          style={{ width: `${dividerLeft}%` }}
          onWheel={(e) => {
            setPrepackScale(
              prepackScale +
              (e.deltaY < 0
                ? 0.05 * (prepackScale < 1)
                : -0.05 * (prepackScale > 0.1)),
            );
          }}
        >
          <div className={styles.container}>
            <Prepack
              prepackStore={prepackStore}
              scale={prepackScale}
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
              text: "Экспорт PDF",
              id: "print-btn",
              onClick: () => {
                takeScreenshot((image) => {
                  const pdf = new jsPDF({
                    orientation: "landscape",
                    unit: "px",
                    format: [image.width, image.height],
                  });

                  pdf.addImage(image, "PNG", 0, 0, image.width, image.height);

                  pdf.save("screenshot.pdf");
                })
              },
            },
            {
              text: "Экспорт JPG",
              id: "export-btn",
              onClick: () => {
                takeScreenshot((image) => {
                  const link = document.createElement("a");
                  link.href = image.src;
                  link.download = "screenshot.jpg";

                  link.click();
                })
              },
            },
          ]}
        />
        <div
          className={styles.shelves}
          style={{ width: `calc(${100 - dividerLeft}% - 1px)` }}
          onWheel={(e) => {
            setShelvesScale(
              shelvesScale +
              (e.deltaY < 0
                ? 0.05 * (shelvesScale < 1)
                : -0.05 * (shelvesScale > 0.1)),
            );
          }}
        >
          {rowsArr}
        </div>
      </div>
    </main>
  );
}
