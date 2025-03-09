"use client";

import cx from "classnames";
import { useState } from "react";
import Select from "react-select";
import styles from "./css/topMenu.module.scss";
import { useFilterStore } from "store/filterStore";

export default function TopMenu({ style = {}, className = null }) {
    const filterStore = useFilterStore();

    const fieldOptions = filterStore.fields.map((field) => ({
        value: field.param,
        label: field.name,
    }));

    const dateOptions = [
        { value: "off", label: "Отключен" },
        { value: "created", label: "Дата создания" },
        { value: "updated", label: "Дата обновления" },
    ];

    return (
        <div className={cx(styles.topMenu, className)} style={style}>
            <div className={styles.fieldFilter}>
                <p>Фильтр по полю</p>
                <Select
                    options={[
                        { value: "off", label: "Отключен" },
                        ...fieldOptions,
                    ]}
                    onChange={(selectedOption) => {
                        filterStore.setParam(selectedOption.value);
                    }}
                    value={
                        fieldOptions.find(
                            (option) => option.value === filterStore.param,
                        ) || { value: "off", label: "Отключен" }
                    }
                />
                <p>со значением</p>
                <input
                    type="text"
                    value={filterStore.value}
                    className={styles.textInput}
                    onChange={(e) => {
                        filterStore.setValue(e.target.value);
                    }}
                />
            </div>
            <div className={styles.multiSelectFilter}>
                <Select
                    options={[...fieldOptions]}
                    onChange={(selectedOptions) => {
                        filterStore.setParam(
                            selectedOptions.map((option) => option.value),
                        );
                    }}
                    isMulti
                    value={fieldOptions.filter(
                        (option) =>
                            Array.isArray(filterStore.param) &&
                            filterStore.param.includes(option.value),
                    )}
                />
            </div>

            <div className={styles.dateFilter}>
                <p>Фильтр по дате</p>
                <Select
                    options={dateOptions}
                    onChange={(selectedOption) => {
                        filterStore.setDateFilter({
                            param: selectedOption.value,
                        });
                    }}
                    value={
                        dateOptions.find(
                            (option) =>
                                option.value === filterStore.dateFilter.param,
                        ) || { value: "off", label: "Отключен" }
                    }
                />
                <p>От</p>
                <input
                    type="date"
                    value={filterStore.dateFilter.from}
                    className={styles.textInput}
                    onChange={(e) => {
                        if (filterStore.dateFilter.to !== "")
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
                    className={styles.textInput}
                    onChange={(e) => {
                        if (filterStore.dateFilter.from !== "")
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
