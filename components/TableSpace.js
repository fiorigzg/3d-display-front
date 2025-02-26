"use client";

import cx from "classnames";

import styles from "./css/tableSpace.module.scss";

export default function TableSpace({ style = {}, className = null, children }) {
    return (
        <div className={cx(styles.tableSpace, className)} style={style}>
            {children}
        </div>
    );
}
