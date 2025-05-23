"use client";

import cx from "classnames";
import styles from "./css/horizontalSize.module.scss";

export default function HorizontalSize({
    value,
    width,
    bottom,
    left,
    color,
}) {
    return (
        <div
            className={styles.horizontalSize}
            style={{
                bottom: bottom,
                left: left,
                width: width,
            }}
        >
          <p style={{
            color: color,
          }}>{value}</p>
          <div style={{
            backgroundColor: color,
          }}/>
        </div>
    );
}
