"use client";

import cx from "classnames";
import { useState } from "react";
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
                    <option value="off">Отключен</option>
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
            <div className={styles.dateFilter}>
                <p>Фильтр по дате</p>
                <select
                    onChange={(e) => {
                        filterStore.setDateFilter({
                            param: e.target.value,
                        });
                    }}
                    value={filterStore.dateFilter.param}
                >
                    <option value="off">Отключен</option>
                    <option value="created">Дата создания</option>
                    <option value="updated">Дата обновления</option>
                </select>
                <p>От</p>
                <input
                    type="date"
                    value={filterStore.dateFilter.from}
                    onChange={(e) => {
                        if (filterStore.dateFilter.to != "")
                            filterStore.setDateFilter({
                                from: e.target.value,
                            });
                        else
                            filterStore.setDateFilter({
                                from: e.target.value,
                                to: e.target.value,
                            });
                    }}
                />
                <p>До</p>
                <input
                    type="date"
                    value={filterStore.dateFilter.to}
                    onChange={(e) => {
                        if (filterStore.dateFilter.from != "")
                            filterStore.setDateFilter({
                                to: e.target.value,
                            });
                        else
                            filterStore.setDateFilter({
                                from: e.target.value,
                                to: e.target.value,
                            });
                    }}
                />
            </div>
        </div>
    );
}
