"use client";

import cx from "classnames";
import { useState } from "react";
import Select from "react-select";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import styles from "./css/topMenu.module.scss";
import { useFilterStore } from "store/filterStore";

export default function TopMenu() {
  const filterStore = useFilterStore();

  const [fieldFilterValue, setFieldFilterValue] = useState("");
  const [dateFilterValue, setDateFilterValue] = useState("");

  function setRealDateFilter() {
    let newValue = { ...dateFilterValue };
    if (newValue.to == "" && newValue.from != "") newValue.to = newValue.from;
    if (newValue.from == "" && newValue.to != "") newValue.from = newValue.to;

    setDateFilterValue(newValue);
    filterStore.setDateFilter(newValue);
  }

  const fieldOptions = filterStore.fields.map((field) => ({
    value: field.param,
    label: field.name,
  }));
  const filterOptions = filterStore.filterFields.map((field) => ({
    value: field.param,
    label: field.name,
  }));
  const dateOptions = filterStore.dateFields.map((field) => ({
    value: field.param,
    label: field.name,
  }));
  const sortOptions = [
    { value: "increase", label: "Возрастанию" },
    { value: "decrease", label: "Убыванию" },
  ];

  const selectStyle = {
    control: (base, state) => ({
      ...base,
      fontSize: "14px",
      maxWidth: "300px",
      border: state.isFocused ? "4px solid #c8dff6" : "0px solid #c8dff6",
      boxShadow: "0px 0px 0px 1px #dcdbd9 inset",
      borderRadius: "8px",
      margin: state.isFocused ? "0" : "0 4px",
      "&:hover": {
        boxShadow: "0px 0px 0px 1px #8d879c inset",
      }
    }),
  };
  const multiSelectStyle = {
    control: (base, state) => ({
      ...base,
      fontSize: "14px",
      maxWidth: "250px",
      border: state.isFocused ? "4px solid #c8dff6" : "none",
      boxShadow: "0px 0px 0px 1px #dcdbd9 inset",
      borderRadius: "8px",
      margin: state.isFocused ? "0" : "0 4px",
      "&:hover": {
        boxShadow: "0px 0px 0px 1px #8d879c inset",
      }
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
    <div className={styles.topMenu}>
      <div className={styles.menuRow}>
        <div className={styles.fieldFilter}>
          <p>Фильтр по полю</p>
          <Select
            options={[{ value: "off", label: "Отключен" }, ...filterOptions]}
            onChange={(selectedOption) => {
              filterStore.setFieldFilterParam(selectedOption.value);
              setFieldFilterValue("");
            }}
            styles={selectStyle}
            value={
              filterOptions.find(
                (option) => option.value === filterStore.fieldFilter.param,
              ) || { value: "off", label: "Отключен" }
            }
          />
          <p>со значением</p>
          <input
            type="text"
            value={fieldFilterValue}
            className={styles.textInput}
            onChange={(e) => {
              setFieldFilterValue(e.target.value);
            }}
            onBlur={(e) => {
              filterStore.setFieldFilterValue(e.target.value);
            }}
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                filterStore.setFieldFilterValue(e.target.value);
              }
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
            options={[{ value: "off", label: "Отключен" }, ...dateOptions]}
            onChange={(selectedOption) => {
              filterStore.setDateFilter({
                param: selectedOption.value,
              });
            }}
            styles={selectStyle}
            value={
              dateOptions.find(
                (option) => option.value === filterStore.dateFilter.param,
              ) || { value: "off", label: "Отключен" }
            }
          />
          <p>От</p>
          <DatePicker
            selected={
              dateFilterValue.from ? new Date(dateFilterValue.from) : null
            }
            onChange={(date) => {
              const formattedDate = date
                ? date.toISOString().split("T")[0]
                : "";
              setDateFilterValue({
                from: formattedDate,
                to: dateFilterValue.to,
              });
            }}
            onBlur={() => setRealDateFilter()}
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                setRealDateFilter();
              }
            }}
            dateFormat="dd/MM/yyyy"
            className={cx(styles.textInput, styles.dateInput)}
          />
          <p>До</p>
          <DatePicker
            selected={dateFilterValue.to ? new Date(dateFilterValue.to) : null}
            onChange={(date) => {
              const formattedDate = date
                ? date.toISOString().split("T")[0]
                : "";
              setDateFilterValue({
                from: dateFilterValue.from,
                to: formattedDate,
              });
            }}
            onBlur={() => setRealDateFilter()}
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                setRealDateFilter();
              }
            }}
            dateFormat="dd/MM/yyyy"
            className={cx(styles.textInput, styles.dateInput)}
          />
        </div>
        <div className={styles.fieldFilter}>
          <p>Сортировка по полю</p>
          <Select
            options={[{ value: "off", label: "Отключен" }, ...fieldOptions]}
            onChange={(selectedOption) => {
              filterStore.setFieldSorter({
                param: selectedOption.value,
              });
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
              filterStore.setFieldSorter({
                direction: selectedOption.value,
              });
            }}
            styles={selectStyle}
            value={sortOptions.find(
              (option) => option.value === filterStore.fieldSorter.direction,
            )}
          />
        </div>
      </div>
    </div>
  );
}
