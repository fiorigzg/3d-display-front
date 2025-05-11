"use client";

import { useEffect, useRef, useState } from "react";
import { toPng } from "html-to-image";
import cx from "classnames";
import axios from "axios";

import { usePrepackStore } from "store/prepackStore";
import { useProductsStore } from "store/productsStore";
import styles from "./page.module.scss";
import VerticalDivider from "components/VerticalDivider";
import Prepack from "components/Prepack";
import TopShelf from "components/TopShelf";
import FrontShelf from "components/FrontShelf";
import { jsonFromRows } from "api/prepackApi";
import { serverUrl } from "constants/main";

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
      const printButton = document.querySelector("#print-btn");
      exportButton.style.display = "none";
      printButton.style.display = "none";

      const dataUrl = await toPng(element, {
        width: element.scrollWidth,
        height: element.scrollHeight,
        style: {
          transform: "none",
          transformOrigin: "top left",
        },
      });

      exportButton.style.display = "block";
      printButton.style.display = "block";

      const image = new Image();
      image.src = dataUrl;
      image.onload = () => after(image);
    } catch (error) {
      console.error("Failed to capture screenshot:", error);
    }
  }

  async function uploadForPrintImage(querySelector, saveName) {
    try {
      const element = document.querySelector(querySelector);
      console.log(element);
      const dataUrl = await toPng(element, {
        width: element.scrollWidth,
        height: element.scrollHeight,
        style: {
          transform: "none",
          transformOrigin: "top left",
        },
      });

      const response = await fetch(dataUrl);
      const blob = await response.blob();
      const formData = new FormData();
      formData.append("file", blob, `${saveName}.png`);

      const axiosResponse = await axios.post(
        `${serverUrl}/uploadfile?save_name=${saveName}`,
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        },
      );

      if (axiosResponse.status !== 200) {
        throw new Error(`Failed to upload element: ${axiosResponse.status}`);
      }

      return axiosResponse.data.original_file.replace("/loadfile", "media");
    } catch (error) {
      console.error("Failed to upload element:", error);
    }
  }

  async function printPage() {
    try {
      let req = {};

      req.header = {
        client_name: prepackStore.clientName,
        project_name: prepackStore.projectName,
        poultice_name: prepackStore.name,
        date: new Date().toLocaleDateString(),
      };

      req.footer = {
        pack_size: `${prepackStore.sideHeight + prepackStore.frontonHeight}x${prepackStore.width}x${prepackStore.depth}`,
        pack_in_box: `${prepackStore.boxSizes.width}x${prepackStore.boxSizes.height}x${prepackStore.boxSizes.depth}`,
      };

      req.left_image = await uploadForPrintImage(
        "#prepack-image",
        `prepack-${prepackStore.id}`,
      );

      req.shelf_data = [];
      for (const shelfId in prepackStore.shelves) {
        const shelf = prepackStore.shelves[shelfId];
        let shelfJson = {};

        shelfJson.images = [
          await uploadForPrintImage(
            `#front-shelf-${shelfId}-image`,
            `front-shelf-${prepackStore.id}-${shelfId}`,
          ),
          await uploadForPrintImage(
            `#top-shelf-${shelfId}-image`,
            `top-shelf-${prepackStore.id}-${shelfId}`,
          ),
        ];

        let shelfProducts = {};
        if ("elems" in shelf.json) {
          for (const elem of shelf.json.elems) {
            const product =
              productsStore.products[queryParams.clientId][elem.productId];

            if (product != undefined) {
              if (!(elem.productId in shelfProducts)) {
                shelfProducts[elem.productId] = {
                  name: product.name,
                  quantity: 1,
                };
              } else {
                shelfProducts[elem.productId].quantity++;
              }
            }
          }
        }

        shelfJson.description = Object.values(shelfProducts);
        req.shelf_data.push(shelfJson);
      }
      console.log(req);

      const res = await axios.post(
        `${serverUrl}/pdf_maker/generate_plannogram`,
        req,
      );
      console.log(res);
      const blob = new Blob([res.data], { type: "application/pdf" });
      const url = URL.createObjectURL(blob);

      const link = document.createElement("a");

      link.href = url;
      link.download = "document.pdf"; // You can change the filename if needed

      document.body.appendChild(link);
      link.click();
    } catch (error) {
      console.log("Failed to print page:", error);
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
            {
              text: "Печать",
              id: "print-btn",
              onClick: () => {
                printPage();
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
