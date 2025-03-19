"use member";

import { create } from "zustand";

export const useFilterStore = create((set) => ({
    fields: [],
    filterFields: [],
    dateFields: [],
    selectOptions: {},
    fieldFilter: { param: "off", value: "", options: [] },
    dateFilter: { param: "off", from: "", to: "" },
    fieldSorter: { param: "off", direction: "increase" },
    excludedFields: [],

    setFields: (header, excludedFields = []) => {
        let newFields = header
            .filter((field) => field.type != "button")
            .map((field) => {
                return { name: field.name, param: field.param };
            });
        let newFilterFields = header
            .filter((field) => field.type != "button" && field.type != "date")
            .map((field) => {
                return { name: field.name, param: field.param };
            });
        let newDateFields = header
            .filter((field) => field.type == "date")
            .map((field) => {
                return { name: field.name, param: field.param };
            });
        set((state) => {
            return {
                fields: newFields,
                filterFields: newFilterFields,
                dateFields: newDateFields,
                fieldFilter: { param: "off", value: "", options: [] },
                dateFilter: { param: "off", from: "", to: "" },
                fieldSorter: { param: "off", field: "" },
                excludedFields: excludedFields,
            };
        });
    },
    setSelectOptions: (selectOptions) => {
        set((state) => ({
            selectOptions: selectOptions,
        }));
    },

    setFieldFilterParam: (param) => {
        set((state) => {
            return { fieldFilter: { param: param, value: "", options: [] } };
        });
    },
    setFieldFilterValue: (value) => {
        set((state) => {
            const param = state.fieldFilter.param,
                selectOptions = state.selectOptions;
            if (param in selectOptions) {
                const options = [];
                for (const optionId in selectOptions[param]) {
                    const option = selectOptions[param][optionId];
                    if (option.includes(value)) {
                        options.push(Number(optionId));
                    }
                }
                return {
                    fieldFilter: {
                        param: param,
                        value: value,
                        options: options,
                    },
                };
            } else
                return {
                    fieldFilter: { param: param, value: value, options: [] },
                };
        });
    },

    setDateFilter: (dateFilter) => {
        set((state) => ({
            dateFilter: { ...state.dateFilter, ...dateFilter },
        }));
    },
    setFieldSorter: (fieldSorter) => {
        set((state) => ({
            fieldSorter: { ...state.fieldSorter, ...fieldSorter },
        }));
    },
    setExcludedFields: (excludedFields) => {
        set((state) => ({
            excludedFields: excludedFields,
        }));
    },
}));
