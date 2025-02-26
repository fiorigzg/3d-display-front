"use client";

import cx from "classnames";

import styles from "./css/topMenu.module.scss";
import { useFilterStore } from "store/filterStore";

export default function TopMenu({ style = {}, className = null }) {
    const filterStore = useFilterStore();

    return (
        <div className={cx(styles.topMenu, className)} style={style}>
            <div className={styles.fieldFilter}>
                <p>Фильтр по полю</p>
                <select
                    onChange={(e) => {
                        filterStore.setParam(e.target.value);
                    }}
                    value={filterStore.param}
                >
                    {filterStore.fields.map((field) => (
                        <option key={field.param} value={field.param}>
                            {field.name}
                        </option>
                    ))}
                </select>
                <p>со значением</p>
                <input
                    type="text"
                    value={filterStore.value}
                    onChange={(e) => {
                        filterStore.setValue(e.target.value);
                    }}
                />
            </div>
        </div>
    );
}
