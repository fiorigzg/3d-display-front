"use client";

import cx from "classnames";

import styles from "./css/saveButton.module.scss";
import { useSaveStore } from "store/saveStore";

export default function SaveButton() {
    const saveStore = useSaveStore();

    return (
        <button
            className={styles.saveButton}
            onClick={() => {
                saveStore.save();
            }}
        >
            Сохранить
        </button>
    );
}
