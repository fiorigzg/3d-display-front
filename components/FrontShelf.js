"use client";

import styles from "./css/frontShelf.module.scss";
import { serverUrl } from "constants/main";
import { jsonFromRows } from "api/prepackApi";

export default function FrontShelf({
  prepackStore,
  id,
  scale,
  clientProducts,
}) {
  let shelf = prepackStore.shelves[id];
  const shelfWidth = prepackStore.width - prepackStore.sideThickness * 2;
  const shelfHeight = prepackStore.shelfThickness;

  let productsArr = [];
  let standsArr = [];
  let partitionsArr = [];

  if (shelf.isRows) {
    jsonFromRows(clientProducts, prepackStore, id);
  }

  if ("elems" in shelf.json) {
    for (const elem of shelf.json.elems) {
      const product = clientProducts[elem.productId];
      if (product != undefined) {
        const frontSvg = product.packagingType.front_svg;

        productsArr.push(
          frontSvg == "" ? (
            <div
              className={styles.product}
              style={{
                width: `${product.width * scale}px`,
                height: `${product.height * scale}px`,
                left: `${(elem.x + shelf.padding) * scale}px`,
                bottom: `${(elem.z + shelfHeight) * scale}px`,
              }}
            />
          ) : (
            <img
              className={styles.image}
              src={`${serverUrl}/loadfile/${frontSvg}`}
              style={{
                width: `${product.width * scale}px`,
                height: `${product.height * scale}px`,
                left: `${(elem.x + shelf.padding) * scale}px`,
                bottom: `${(elem.z + shelfHeight) * scale}px`,
              }}
            />
          ),
        );
      }
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
            bottom: `${(stand.z + shelfHeight) * scale}px`,
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
            width: `${partition.width * scale}px`,
            height: `${partition.height * scale}px`,
            left: `${(partition.x + shelf.padding) * scale}px`,
            bottom: `${(partition.z + shelfHeight) * scale}px`,
          }}
        />,
      );
    }
  }

  return (
    <div
      className={styles.shelf}
      style={{
        width: `${shelfWidth * scale}px`,
        height: `${shelfHeight * scale}px`,
      }}
    >
      {productsArr}
      {standsArr}
      {partitionsArr}
    </div>
  );
}
