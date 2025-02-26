"use member";

import { create } from "zustand";

export const useFilterStore = create((set) => ({
    fields: [
        { name: "Название", param: "name" },
        { name: "ID", param: "id" },
    ],
    param: "name",
    value: "",

    setFields: (fields) => {
        fields = fields
            .filter((field) => field.type != "button" && field.type != "select")
            .map((field) => {
                return { name: field.name, param: field.param };
            });
        console.log(fields);
        set((state) => {
            return { fields: fields, param: fields[0].param, value: "" };
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
}));
