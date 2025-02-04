"use client";

import cx from "classnames";

import styles from "./css/verticalSize.module.scss";

export default function VerticalSize({ value, height, top, left }) {
    return (
        <div
            className={cx(styles.verticalSize)}
            style={{
                top: top,
                left: left - 17,
                height: height,
            }}
        >
            <p>{value}</p>
            <div />
        </div>
    );
}
