"use client";

import styles from "./css/topShelf.module.scss";
import { serverUrl } from "constants/main";
import { jsonFromRows } from "api/prepackApi";

export default function TopShelf({ prepackStore, id, scale, clientProducts }) {
  let shelf = prepackStore.shelves[id];
  const shelfWidth = prepackStore.width - prepackStore.sideThickness * 2;
  const shelfDepth =
    prepackStore.depth -
    prepackStore.frontThickness -
    prepackStore.backThickness;

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
        const topSvg = product.packagingType.top_svg;

        productsArr.push(
          topSvg == "" ? (
            <div
              className={styles.product}
              style={{
                width: `${product.width * scale}px`,
                height: `${product.depth * scale}px`,
                left: `${(elem.x + shelf.padding) * scale}px`,
                top: `${(elem.y + shelf.padding) * scale}px`,
                transform: `rotate(${elem.angleTop}deg)`,
              }}
            />
          ) : (
            <img
              className={styles.image}
              src={`${serverUrl}/loadfile/${topSvg}`}
              style={{
                width: `${product.width * scale}px`,
                height: `${product.depth * scale}px`,
                left: `${(elem.x + shelf.padding) * scale}px`,
                top: `${(elem.y + shelf.padding) * scale}px`,
                transform: `rotate(${elem.angleTop}deg)`,
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
            height: `${stand.depth * scale}px`,
            left: `${(stand.x + shelf.padding) * scale}px`,
            top: `${(stand.y + shelf.padding) * scale}px`,
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
            height: `${partition.depth * scale}px`,
            left: `${(partition.x + shelf.padding) * scale}px`,
            top: `${(partition.y + shelf.padding) * scale}px`,
          }}
        />,
      );
    }
  }

  return (
    <div
      className={styles.container}
      id={`top-shelf-${id}-image`}
      key={`top-shelf-${id}`}
      style={{
        width: `${shelfWidth * scale + 2}px`,
        height: `${shelfDepth * scale + 2}px`,
      }}
    >
      <div
        className={styles.shelf}
        style={{
          width: `${shelfWidth * scale}px`,
          height: `${shelfDepth * scale}px`,
        }}
      >
        {productsArr}
        {standsArr}
        {partitionsArr}
      </div>
    </div>
  );
}
