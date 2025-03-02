"use member";

import { create } from "zustand";

export const useFilterStore = create((set) => ({
    fields: [
        { name: "Название", param: "name" },
        { name: "ID", param: "id" },
    ],
    selectOptions: {},
    param: "name",
    value: "",
    options: [],

    setFields: (fields) => {
        fields = fields
            .filter((field) => field.type != "button")
            .map((field) => {
                return { name: field.name, param: field.param };
            });
        set((state) => {
            return {
                fields: fields,
                param: fields[0].param,
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
    setSelectOptions: (selectOptions) => {
        set((state) => {
            return {
                selectOptions: selectOptions,
            };
        });
    },
}));
