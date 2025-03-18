"use client";

import cx from "classnames";
import { useState } from "react";
import Select from "react-select";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
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
    const sortOptions = [
        { value: "increase", label: "По возрастанию" },
        { value: "decrease", label: "По убыванию" },
    ];

    const selectStyle = {
        control: (base) => ({
            ...base,
            fontSize: "14px",
            maxWidth: "300px",
        }),
    };
    const multiSelectStyle = {
        control: (base) => ({
            ...base,
            fontSize: "14px",
            maxWidth: "250px",
        }),
        valueContainer: (base) => ({
            ...base,
            maxHeight: "30px",
            overflow: "scroll",
            scrollbarWidth: "none",
            msOverflowStyle: "none",
        }),
    };

    return (
        <div className={cx(styles.topMenu, className)} style={style}>
            <div className={styles.menuRow}>
                <div className={styles.fieldFilter}>
                    <p>Фильтр по полю</p>
                    <Select
                        options={[
                            { value: "off", label: "Отключен" },
                            ...fieldOptions,
                        ]}
                        onChange={(selectedOption) => {
                            filterStore.setFieldFilterParam(selectedOption.value);
                        }}
                        styles={selectStyle}
                        value={
                            fieldOptions.find(
                                (option) => option.value === filterStore.fieldFilter.param,
                            ) || { value: "off", label: "Отключен" }
                        }
                    />
                    <p>со значением</p>
                    <input
                        type="text"
                        value={filterStore.fieldFilter.value}
                        className={styles.textInput}
                        onChange={(e) => {
                            filterStore.setFieldFilterValue(e.target.value);
                        }}
                    />
                </div>
                <div className={styles.multiSelectFilter}>
                    <p>Скрытые колонки</p>
                    <Select
                        options={[...fieldOptions]}
                        onChange={(selectedOptions) => {
                            const realSelectedOptions = selectedOptions.map(
                                (option) => option.value,
                            );
                            // filterStore.setParam(realSelectedOptions);
                            filterStore.setExcludedFields(realSelectedOptions);
                        }}
                        styles={multiSelectStyle}
                        isMulti
                        value={fieldOptions.filter((option) =>
                            filterStore.excludedFields.includes(option.value),
                        )}
                    />
                </div>
            </div>
            <div className={styles.menuRow}>
                <div className={styles.dateFilter}>
                    <p>Фильтр по дате</p>
                    <Select
                        options={dateOptions}
                        onChange={(selectedOption) => {
                            filterStore.setDateFilter({
                                param: selectedOption.value,
                            });
                        }}
                        styles={selectStyle}
                        value={
                            dateOptions.find(
                                (option) =>
                                    option.value ===
                                    filterStore.dateFilter.param,
                            ) || { value: "off", label: "Отключен" }
                        }
                    />
                    <p>От</p>
                    <DatePicker
                        selected={
                            filterStore.dateFilter.from
                                ? new Date(filterStore.dateFilter.from)
                                : null
                        }
                        onChange={(date) => {
                            const formattedDate = date
                                ? date.toISOString().split("T")[0]
                                : "";
                            if (filterStore.dateFilter.to !== "")
                                filterStore.setDateFilter({
                                    from: formattedDate,
                                });
                            else
                                filterStore.setDateFilter({
                                    from: formattedDate,
                                    to: formattedDate,
                                });
                        }}
                        dateFormat="dd/MM/yyyy"
                        className={cx(styles.textInput, styles.dateInput)}
                    />
                    <p>До</p>
                    <DatePicker
                        selected={
                            filterStore.dateFilter.to
                                ? new Date(filterStore.dateFilter.to)
                                : null
                        }
                        onChange={(date) => {
                            const formattedDate = date
                                ? date.toISOString().split("T")[0]
                                : "";
                            if (filterStore.dateFilter.from !== "")
                                filterStore.setDateFilter({
                                    to: formattedDate,
                                });
                            else
                                filterStore.setDateFilter({
                                    from: formattedDate,
                                    to: formattedDate,
                                });
                        }}
                        dateFormat="dd/MM/yyyy"
                        className={cx(styles.textInput, styles.dateInput)}
                    />
                </div>
                <div className={styles.fieldFilter}>
                    <p>Сортировка по полю</p>
                    <Select
                        options={[
                            { value: "off", label: "Отключен" },
                            ...fieldOptions,
                        ]}
                        onChange={(selectedOption) => {
                            filterStore.setFieldSorter({ param: selectedOption.value });
                        }}
                        styles={selectStyle}
                        value={
                            fieldOptions.find(
                                (option) => option.value === filterStore.fieldSorter.param,
                            ) || { value: "off", label: "Отключен" }
                        }
                    />
                    <p>по</p>
                    <Select
                        options={sortOptions}
                        onChange={(selectedOption) => {
                            filterStore.setFieldSorter({ direction: selectedOption.value });
                        }}
                        styles={selectStyle}
                        value={
                            sortOptions.find(
                                (option) => option.value === filterStore.fieldSorter.direction,
                            )
                        }
                    />
                </div>
            </div>
        </div>
    );
}
