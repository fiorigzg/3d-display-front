"use client";

import cx from "classnames";
import styles from "./css/horizontalSize.module.scss";

export default function HorizontalSize({
    value,
    width,
    bottom,
    left,
    style = {},
    className = null,
}) {
    return (
        <div
            className={cx(styles.horizontalSize, className)}
            style={{
                bottom: bottom,
                left: left,
                width: width,
                ...style,
            }}
        >
            <p>{value}</p>
            <div />
        </div>
    );
}
