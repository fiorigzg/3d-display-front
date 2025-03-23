"use client";

import cx from "classnames";

import styles from "./css/saveButton.module.scss";
import { useSaveStore } from "store/saveStore";

export default function SaveButton({ style = {}, className = null }) {
    const saveStore = useSaveStore();

    return (
        <button
            className={cx(styles.saveButton, className)}
            style={style}
            onClick={() => {
                saveStore.save();
            }}
        >
            Сохранить
        </button>
    );
}
