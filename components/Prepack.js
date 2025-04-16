"use client";

import { useRef } from "react";

import styles from "./css/prepack.module.scss";
import { serverUrl } from "constants/main";
import { usePrepackStore } from "store/prepackStore";
import { useProductsStore } from "store/productsStore";
import Info from "components/Info";
import VerticalSize from "components/VerticalSize";
import HorizontalSize from "components/HorizontalSize";

export default function Prepack({ prepackStore, scale, clientProducts }) {
  const prepackContainerRef = useRef(null);

  let forSizes = { firstShelfMaxProduct: 0 };
  let shelvesArr = [];
  let shelfTop = prepackStore.frontonHeight;

  for (const shelfId in prepackStore.shelves) {
    const shelf = prepackStore.shelves[shelfId];

    shelfTop += shelf.margin;

    let productsArr = [];
    let standsArr = [];
    let partitionsArr = [];
    let isFirstShelf = true;

    if (shelf.isRows) {
      let productLeft = shelf.padding;

      for (const rowId in shelf.rows) {
        const rowEl = shelf.rows[rowId];
        const productEl = clientProducts[rowEl.productId];
        let productsCount = rowEl.count || rowEl.count;

        if (productEl != undefined) {
          productLeft += rowEl.left;
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

          if (isFirstShelf) {
            forSizes.firstShelfMaxProduct = Math.max(
              forSizes.firstShelfMaxProduct,
              productEl.height,
            );
          }
          productLeft += productEl.width;
        }
      }
    } else {
      if ("elems" in shelf.json) {
        for (const elem of shelf.json.elems) {
          const product = clientProducts[elem.productId];

          if (product != undefined) {
            productsArr.push(
              product.frontProjection == "" ? (
                <div
                  className={styles.product}
                  style={{
                    width: `${product.width * scale - 2}px`,
                    height: `${product.height * scale - 4}px`,
                    left: `${(elem.x + shelf.padding) * scale}px`,
                    bottom: `${
                      (elem.z + prepackStore.shelfThickness) * scale + 1
                    }px`,
                  }}
                />
              ) : (
                <img
                  className={styles.image}
                  src={`${serverUrl}/loadfile/${product.frontProjection}`}
                  style={{
                    width: `${product.width * scale}px`,
                    height: `${product.height * scale}px`,
                    left: `${(elem.x + shelf.padding) * scale}px`,
                    bottom: `${
                      (elem.z + prepackStore.shelfThickness) * scale
                    }px`,
                  }}
                />
              ),
            );
          }

          if (isFirstShelf) {
            forSizes.firstShelfMaxProduct = Math.max(
              forSizes.firstShelfMaxProduct,
              product.height + elem.z,
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
                bottom: `${(stand.z + prepackStore.shelfThickness) * scale}px`,
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
                bottom: `${(partition.z + prepackStore.shelfThickness) * scale}px`,
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
  }

  let sizesArr = [];
  if (Object.keys(prepackStore.shelves).length == 0) {
    forSizes.firstShelfTop = 0;
  } else {
    forSizes.firstShelfTop =
      prepackStore.shelves[Object.keys(prepackStore.shelves)[0]].margin;
  }
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
    <div className={styles.prepackContainer} ref={prepackContainerRef}>
      <div
        className={styles.prepack}
        style={{
          width: `${prepackStore.width * scale}px`,
          height: `${
            (prepackStore.sideHeight + prepackStore.frontonHeight) * scale
          }px`,
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
  );
}
