"use member";

import { create } from "zustand";

export const useFilterStore = create((set) => ({
    fields: [],
    param: "off",
    value: "",
    dateFilter: {
        param: "off",
        from: "",
        to: "",
    },

    setFields: (fields) => {
        fields = fields
            .filter((field) => field.type != "button" && field.type != "select")
            .map((field) => {
                return { name: field.name, param: field.param };
            });
        set((state) => {
            return { fields: fields, param: "off", value: "" };
        });
    },
    setParam: (param) => {
        set((state) => {
            return { param: param };
        });
    },
    setValue: (value) => {
        set((state) => {
            return { value: value };
        });
    },
    setDateFilter: (dateFilter) =>
        set((state) => ({
            dateFilter: { ...state.dateFilter, ...dateFilter },
        })),
}));
