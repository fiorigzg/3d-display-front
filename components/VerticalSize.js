"use client";

import cx from "classnames";

import styles from "./css/verticalSize.module.scss";

export default function VerticalSize({
    value,
    height,
    top,
    left,
    style = {},
    className = null,
}) {
    return (
        <div
            className={cx(styles.verticalSize, className)}
            style={{
                top: top,
                left: left - 17,
                height: height,
                ...style,
            }}
        >
            <p>{value}</p>
            <div />
        </div>
    );
}
