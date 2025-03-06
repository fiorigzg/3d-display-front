"use client";

import structuredClone from "@ungap/structured-clone";
import { create } from "zustand";
import {
    getAll,
    getJsonShelf,
    openShelfEditor,
    sendPrepackImage,
} from "api/prepackApi";
import { changeOne, createOne, deleteOne } from "api/commonApi";
import { prepackFields, shelfFields, rowFields } from "constants/fields";
import { initShelf, initRow } from "constants/initValues";

export const usePrepackStore = create((set, get) => ({
    step: "load",
    scale: 0.3,
    id: 0,
    width: 380,
    depth: 280,
    sideHeight: 1320,
    sideThickness: 17,
    backThickness: 10,
    frontThickness: 25,
    shelfThickness: 20,
    frontonHeight: 200,
    topperHeight: 0,

    initAll: async (id) => {
        let newState = await getAll(id);
        set({ ...newState, id: id, step: "make" });
    },
    changePepack: async (param, value) => {
        const id = await get().id;
        let changes = { [param]: value };
        if (param in prepackFields)
            changeOne(`/poultice_${id}`, changes, prepackFields);
        set(changes);
    },
    addScale: (isPositive) =>
        set((state) => {
            let newScale = state.scale + (isPositive ? 0.01 : -0.01);
            if (newScale < 0.1 || newScale > 1) newScale = state.scale;
            return {
                scale: newScale,
            };
        }),
    sendPrepackImage: async (dataUrl) => {
        const id = get().id;
        sendPrepackImage(dataUrl, id);
    },

    shelves: {},
    changeShelvesCount: async (value) => {
        let shelves = get().shelves;
        let prepackId = get().id;

        let count = Object.keys(shelves).length;
        if (count < value) {
            for (let i = count + 1; i <= value; i++) {
                const newShelf = { ...initShelf, prepackId: prepackId };
                const newShelfId = await createOne(
                    "/shelf",
                    "shelf_id",
                    newShelf,
                    shelfFields,
                );
                shelves[newShelfId] = newShelf;
            }
        } else {
            for (let i = count; i > value; i--) {
                const lastShelfId = Object.keys(shelves).pop();
                await deleteOne(`/shelf_${lastShelfId}`);
                delete shelves[lastShelfId];
            }
        }
        set({ shelves: shelves });
    },
    switchShelfExtend: (id) => {
        let shelves = get().shelves;
        shelves[id].isExtended = !shelves[id].isExtended;

        set({ shelves: shelves });
    },
    changeShelf: async (ids, param, value) => {
        let shelves = get().shelves;
        shelves[ids.shelfId][param] = value;
        if (param in shelfFields)
            changeOne(`/shelf_${ids.shelfId}`, { [param]: value }, shelfFields);

        set({ shelves: shelves });
    },
    makeShelf: async (ids, products, clientId) => {
        let state = get();
        let shelves = state.shelves;

        let shelfChanges = await openShelfEditor(
            products,
            state,
            ids.shelfId,
            clientId,
        );

        shelves[ids.shelfId] = { ...shelves[ids.shelfId], ...shelfChanges };
        set({ shelves: shelves });
    },
    updateShelfJson: async (ids) => {
        let shelves = get().shelves;
        let json = await getJsonShelf(ids.shelfId);
        shelves[ids.shelfId].json = json;

        set({ shelves: shelves });
    },

    changeRowsCount: async (ids, value, defaultProductId) => {
        let shelves = get().shelves;
        let rows = structuredClone(shelves[ids.shelfId].rows);
        let count = Object.keys(rows).length;
        if (count < value) {
            for (let i = count + 1; i <= value; i++) {
                rows[i] = {
                    ...initRow,
                    productId: defaultProductId,
                };
            }
        } else {
            for (let i = count; i > value; i--) {
                delete rows[i];
            }
        }
        changeOne(`/shelf_${ids.shelfId}`, { rows: rows }, shelfFields);

        shelves[ids.shelfId].rows = rows;
        set({ shelves: shelves });
    },
    changeRow: (ids, param, value) => {
        let shelves = get().shelves;
        let shelf = shelves[ids.shelfId];
        shelf.rows[ids.rowId][param] = value;
        if (param in rowFields) {
            changeOne(`/shelf_${ids.shelfId}`, shelf, shelfFields);
        }

        set({ shelves: shelves });
    },
}));
