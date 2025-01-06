"use client";

import cx from "classnames";

import styles from "./css/subblock.module.scss";

export default function Subblock({
    style={}, className=null, children=null
}) {
    return (
        <div className={cx(styles.subblock, className)} style={style}>
            {children}
        </div>
    );
}