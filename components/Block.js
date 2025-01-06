"use client"

import cx from "classnames";

import styles from "./css/block.module.scss";

export default function Block({
    style={}, className=null, children=null
}) {
    return (
        <div className={cx(styles.block, className)} style={style}>
            {children}
        </div>
    );
}