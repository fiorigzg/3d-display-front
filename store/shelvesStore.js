"use client";

import { create } from "zustand";
import { getAll, saveAll } from "api/shelvesApi";

export const useShelvesStore = create((set, get) => ({
    standId: 0,
    standHeight: 100,
    standWidth: 100,
    scale: 0.3,
    shelfSpacings: [70],
    products: [[]],
    liners: [[]],
    partWidths: {
        side: 10,
        top: 10,
        bottom: 20,
        shelf: 30,
    },

    initAll: async () => {
        const partWidths = get().partWidths;
        let data = await getAll(partWidths);
        set(() => {
            return { ...data };
        });
    },
    saveAll: async (standImageDataUrl) => {
        await saveAll(standImageDataUrl, get().standId);
    },

    setShelfSpacing: (shelfSpacingId, value) =>
        set((state) => {
            let newShelfSpacings = state.shelfSpacings;
            if (value < 50) value = 50;

            let spaceToDistribute =
                value - state.shelfSpacings[shelfSpacingId - 1];

            if (spaceToDistribute > 0) {
                let shelfSpacingMoveId =
                    shelfSpacingId == newShelfSpacings.length ? -1 : 1;
                for (
                    let nextShelfSpacingId =
                        shelfSpacingId + shelfSpacingMoveId;
                    nextShelfSpacingId <= newShelfSpacings.length &&
                    nextShelfSpacingId > 0;
                    nextShelfSpacingId += shelfSpacingMoveId
                ) {
                    if (spaceToDistribute > 0) {
                        let nextShelfSpacingValue = Math.max(
                            state.shelfSpacings[nextShelfSpacingId - 1] -
                                spaceToDistribute,
                            50,
                        );
                        let distributedSpace =
                            state.shelfSpacings[nextShelfSpacingId - 1] -
                            nextShelfSpacingValue;
                        newShelfSpacings[nextShelfSpacingId - 1] =
                            nextShelfSpacingValue;
                        spaceToDistribute -= distributedSpace;
                    } else {
                        break;
                    }
                }
            } else {
                let nextShelfSpacingId =
                    shelfSpacingId == newShelfSpacings.length
                        ? shelfSpacingId - 1
                        : shelfSpacingId + 1;
                newShelfSpacings[nextShelfSpacingId - 1] -= spaceToDistribute;
                spaceToDistribute = 0;
            }
            newShelfSpacings[shelfSpacingId - 1] = value - spaceToDistribute;

            return {
                shelfSpacings: newShelfSpacings,
            };
        }),
    addScale: (isPositive) =>
        set((state) => {
            let newScale = state.scale + (isPositive ? 0.01 : -0.01);
            if (newScale < 0.1 || newScale > 1) newScale = state.scale;
            return {
                scale: newScale,
            };
        }),
}));
