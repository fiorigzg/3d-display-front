"use client";

import { useEffect, useRef } from "react";
import html2canvas from "html2canvas";

import { serverUrl } from "constants/main";
import { useShelvesStore } from "store/shelvesStore";
import styles from "./page.module.scss";
import Info from "components/Info";
import VerticalSize from "components/VerticalSize";

export default function Home() {
    const standRef = useRef(null);
    const shelvesStore = useShelvesStore();

    useEffect(() => {
        shelvesStore.initAll();
    }, []);

    let shelfBoxesArr = [];
    let firstShelfTopPoint = 0;
    const { scale, standWidth, standHeight } = shelvesStore;

    let marginTop = shelvesStore.partWidths.top;
    for (
        let shelfSpacingId = 1;
        shelfSpacingId <= shelvesStore.shelfSpacings.length;
        shelfSpacingId++
    ) {
        let shelfSpacing = shelvesStore.shelfSpacings[shelfSpacingId - 1];

        let productsArr = [];
        let shelfProducts = shelvesStore.products[shelfSpacingId - 1];
        for (
            let productId = 1;
            productId <= shelfProducts.length;
            productId++
        ) {
            let product = shelfProducts[productId - 1];

            if (shelfSpacingId == 1)
                firstShelfTopPoint = Math.max(
                    firstShelfTopPoint,
                    product.bottom + product.height,
                );

            productsArr.push(
                <img
                    src={`${serverUrl}/loadfile/${product.image}`}
                    alt={product.name}
                    key={productId}
                    className={styles.product}
                    width={30}
                    height={30}
                    style={{
                        width: `calc(${product.width * scale}px)`,
                        height: `calc(${product.height * scale}px)`,
                        top: `calc(100% - ${product.height * scale}px - ${product.bottom * scale}px)`,
                        left: `calc(${product.left * scale}px)`,
                    }}
                />,
            );
        }

        let linersArr = [];
        let shelfLiners = shelvesStore.liners[shelfSpacingId - 1];
        for (let linerId = 1; linerId <= shelfLiners.length; linerId++) {
            let liner = shelfLiners[linerId - 1];
            linersArr.push(
                <div
                    key={linerId}
                    className={styles.liner}
                    style={{
                        width: `calc(${liner.width * scale}px - 1px)`,
                        height: `calc(${liner.height * scale}px - 1px)`,
                        top: `calc(100% - ${liner.height * scale}px - ${liner.bottom * scale}px)`,
                        left: `calc(${liner.left * scale}px)`,
                    }}
                />,
            );
        }

        shelfBoxesArr.push(
            <div
                className={styles.box}
                key={shelfSpacingId}
                style={{
                    width: `calc(${standWidth * scale}px - ${shelvesStore.partWidths.side * scale * 2}px - 2px)`,
                    height: `calc(${shelfSpacing * scale}px - 2px)`,
                    top: `calc(50% - ${(standHeight / 2) * scale}px + ${marginTop * scale}px)`,
                    left: `calc(50% - ${(standWidth / 2) * scale}px + ${shelvesStore.partWidths.side * scale}px)`,
                }}
            >
                {shelvesStore.step == "make" ? (
                    <Info
                        key={shelfSpacingId}
                        value={shelfSpacing}
                        style={{
                            top: `calc(50% - 12px)`,
                            left: `calc(100% + ${shelvesStore.partWidths.side * scale}px + 10px)`,
                        }}
                        onEnter={(value) => {
                            shelvesStore.setShelfSpacing(shelfSpacingId, value);
                        }}
                    />
                ) : null}
                {productsArr}
                {linersArr}
            </div>,
        );

        marginTop += shelfSpacing + shelvesStore.partWidths.shelf;
    }

    return (
        <main className={styles.main}>
            <div
                className={styles.ws}
                onWheel={(e) => {
                    shelvesStore.addScale(e.deltaY > 0);
                }}
            >
                <div
                    className={styles.box}
                    ref={standRef}
                    style={{
                        width: `calc(${standWidth * scale}px - 2px)`,
                        height: `calc(${standHeight * scale}px - 2px)`,
                        top: `calc(50% - ${(standHeight / 2) * scale}px)`,
                        left: `calc(50% - ${(standWidth / 2) * scale}px)`,
                    }}
                >
                    {shelvesStore.step == "make" ? (
                        <div>
                            <Info
                                key={-1}
                                value={standHeight}
                                style={{
                                    top: `calc(50% - 12px)`,
                                    left: `calc(50% - ${(standWidth / 2) * scale}px - 65px)`,
                                }}
                                isActive={false}
                            />
                            <Info
                                key={-2}
                                value={standWidth}
                                style={{
                                    top: `calc(50% - ${(standHeight / 2) * scale}px - 32px)`,
                                    left: `calc(50% - 27px)`,
                                }}
                                isActive={false}
                            />
                        </div>
                    ) : null}
                    {shelvesStore.step == "send" ? (
                        <div>
                            <VerticalSize
                                value={
                                    shelvesStore.shelfSpacings -
                                    firstShelfTopPoint
                                }
                                height={
                                    (shelvesStore.shelfSpacings -
                                        firstShelfTopPoint) *
                                    scale
                                }
                                left={-40}
                                top={0}
                            />
                        </div>
                    ) : null}
                    {shelfBoxesArr}
                </div>
            </div>
            <div className={styles.menu}>
                <button
                    className={styles.completeBtn}
                    onClick={() => {
                        if (shelvesStore.step == "make")
                            shelvesStore.nextStep();
                        else {
                            html2canvas(standRef.current, {
                                useCORS: true,
                                allowTaint: true,
                            }).then((canvas) => {
                                const dataUrl = canvas.toDataURL("image/png");
                                shelvesStore.saveAll(dataUrl);
                            });
                        }
                    }}
                >
                    {shelvesStore.step == "make" ? "Закончить" : "Отправить"}
                </button>
            </div>
        </main>
    );
}
