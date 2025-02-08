"use client";

import { create } from "zustand";

export const usePrepackStore = create((set, get) => ({
    step: "make",
    id: 0,
    width: 0,
    depth: 0,
    sideHeight: 0,
    sideThickness: 0,
    backThickness: 0,
    frontThickness: 0,
    shelfThickness: 0,
    frontHeight: 0,
    topperHeight: 0,
    changeValue: (param, value) => {
        set({ [param]: value });
    },

    shelves: {
        1: { isExtended: true, rows: { 1: { productId: 1, left: 0 } } },
    },
    changeShelvesCount: (value) => {
        let shelves = get().shelves;
        let count = Object.keys(shelves).length;
        if (count < value) {
            for (let i = count + 1; i <= value; i++) {
                shelves[i] = {
                    isExtended: false,
                    rows: {},
                };
            }
        } else {
            for (let i = count; i > value; i--) {
                delete shelves[i];
            }
        }
        set({ shelves: shelves });
    },
}));
