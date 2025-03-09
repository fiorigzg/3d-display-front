"use member";

import { create } from "zustand";

export const useFilterStore = create((set) => ({
    fields: [],
    param: "off",
    selectOptions: {},
    multiSelectOptions: {},
    value: "",
    options: [],
    dateFilter: {
        param: "off",
        from: "",
        to: "",
    },

    setFields: (fields) => {
        fields = fields
            .filter((field) => field.type != "button")
            .map((field) => {
                return { name: field.name, param: field.param };
            });
        set((state) => {
            return {
                fields: fields,
                param: "off",
                value: "",
                options: [],
            };
        });
    },
    setParam: (param) => {
        set((state) => {
            return { param: param, value: "", options: [] };
        });
    },
    setValue: (value) => {
        set((state) => {
            const param = state.param,
                selectOptions = state.selectOptions;
            if (param in selectOptions) {
                const options = [];
                for (const optionId in selectOptions[param]) {
                    const option = selectOptions[param][optionId];
                    if (option.includes(value)) {
                        options.push(Number(optionId));
                    }
                }
                console.log(options);
                return { value: value, options: options };
            } else return { value: value, options: [] };
        });
    },
    setDateFilter: (dateFilter) =>
        set((state) => ({
            dateFilter: { ...state.dateFilter, ...dateFilter },
        })),
    setSelectOptions: (selectOptions) => {
        set((state) => {
            return {
                selectOptions: selectOptions,
            };
        });
    },
    setMultiselectOptions: (multiSelectOptions) => {
        set((state) => {
            return {
                multiSelectOptions: multiSelectOptions,
            };
        });
    },
}));
