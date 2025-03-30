"use client";

import structuredClone from "@ungap/structured-clone";
import { create } from "zustand";
import {
    getAll,
    getJsonShelf,
    openShelfEditor,
    sendPrepackImage,
    saveAll,
} from "api/prepackApi";
import { changeOne, createOne, deleteOne } from "api/prepackApi";
import { prepackFields, shelfFields, rowFields } from "constants/fields";
import { initShelf, initRow } from "constants/initValues";
import { reloadOnSave } from "constants/main";

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
    boxSizes: { width: 0, height: 0, depth: 0 },
    session: 0,

    initAll: async (id) => {
        let newState = await getAll(id);
        set({ ...newState, id: id, step: "make", session: Date.now() });
    },
    changePepack: async (param, value) => {
        const id = await get().id;
        const session = await get().session;
        let changes = { [param]: value };
        changeOne(`/poultice_${id}`, changes, prepackFields, session);
        set(changes);
    },
    changeBoxSizes: async (param, value) => {
        const id = await get().id;
        const session = await get().session;
        let boxSizes = get().boxSizes;
        if (param in boxSizes) boxSizes[param] = value;
        let changes = { boxSizes: boxSizes };
        changeOne(`/poultice_${id}`, changes, prepackFields, session);
        let newState = await getAll(id, session);
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

        await sendPrepackImage(dataUrl, id);
    },
    saveAll: async () => {
        const session = get().session;

        await saveAll(session);
        if (reloadOnSave) window.location.reload();
    },

    shelves: {},
    changeShelvesCount: async (value) => {
        let shelves = get().shelves;
        const prepackId = get().id;
        const session = get().session;

        let count = Object.keys(shelves).length;
        if (count < value) {
            for (let i = count + 1; i <= value; i++) {
                const newShelf = { ...initShelf, prepackId: prepackId };
                const newShelfId = await createOne(
                    "/shelf",
                    newShelf,
                    shelfFields,
                    "shelf_id",
                    session,
                );
                shelves[newShelfId] = newShelf;
            }
        } else {
            for (let i = count; i > value; i--) {
                const lastShelfId = Object.keys(shelves).pop();

                await deleteOne(`/shelf_${lastShelfId}`, session);
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
        const session = get().session;
        shelves[ids.shelfId][param] = value;
        if (param in shelfFields)
            changeOne(
                `/shelf_${ids.shelfId}`,
                { [param]: value },
                shelfFields,
                session,
            );

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
            state.session,
        );

        shelves[ids.shelfId] = { ...shelves[ids.shelfId], ...shelfChanges };
        set({ shelves: shelves });
    },
    updateShelfJson: async (ids) => {
        let shelves = get().shelves;
        let session = get().session;
        let json = await getJsonShelf(ids.shelfId, session);
        console.log(json);
        shelves[ids.shelfId].json = json;

        set({ shelves: shelves });
    },

    changeRowsCount: async (ids, value, defaultProductId) => {
        let shelves = get().shelves;
        const session = get().session;
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
        changeOne(
            `/shelf_${ids.shelfId}`,
            { rows: rows },
            shelfFields,
            session,
        );

        shelves[ids.shelfId].rows = rows;
        set({ shelves: shelves });
    },
    deleteRow: async (ids) => {
        let shelves = get().shelves;
        let shelf = shelves[ids.shelfId];
        const session = get().session;
        if (shelf.rows[ids.rowId]) {
            delete shelf.rows[ids.rowId];

            let newRows = {};
            let newRowId = 1;
            for (let oldRowId in shelf.rows) {
                newRows[newRowId] = shelf.rows[oldRowId];
                newRowId++;
            }
            shelf.rows = newRows;

            await changeOne(
                `/shelf_${ids.shelfId}`,
                { rows: shelf.rows },
                shelfFields,
                session,
            );
            set({ shelves: shelves });
        }
    },
    changeRow: (ids, param, value) => {
        const session = get().session;
        let shelves = get().shelves;
        let shelf = shelves[ids.shelfId];
        shelf.rows[ids.rowId][param] = value;
        if (param in rowFields) {
            changeOne(`/shelf_${ids.shelfId}`, shelf, shelfFields, session);
        }

        set({ shelves: shelves });
    },
}));
