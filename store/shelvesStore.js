"use client";

import { create } from "zustand";

export const useShelvesStore = create((set) => ({
  standHeight: 2000,
  standWidth: 500,
  scale: 0.3,
  shelfSpacings: [500, 400, 1020],
  products: [
    [
      { name: "lays", left: 0, bottom: 0, width: 163, height: 200 },
      { name: "nivea", left: 163, bottom: 0, width: 100, height: 300 },
      { name: "lays", left: 263, bottom: 0, width: 163, height: 200 },
    ],
    [
      { name: "nivea", left: 30, bottom: 40, width: 100, height: 300 },
      { name: "nivea", left: 140, bottom: 40, width: 100, height: 300 },
      { name: "nivea", left: 250, bottom: 40, width: 100, height: 300 },
      { name: "nivea", left: 360, bottom: 40, width: 100, height: 300 },
      { name: "nivea", left: 85, bottom: 0, width: 100, height: 300 },
      { name: "nivea", left: 195, bottom: 0, width: 100, height: 300 },
      { name: "nivea", left: 305, bottom: 0, width: 100, height: 300 },
    ],
    [
      { name: "lays", left: 10, bottom: 0, width: 163, height: 200 },
      { name: "lays", left: 300, bottom: 50, width: 163, height: 200 },
    ],
  ],
  liners: [
    [],
    [{ left: 30, bottom: 0, width: 430, height: 40 }],
    [
      { left: 250, bottom: 0, width: 200, height: 20 },
      { left: 300, bottom: 20, width: 150, height: 30 },
    ],
  ],
  partWidths: {
    side: 10,
    top: 10,
    bottom: 20,
    shelf: 30,
  },
  setShelfSpacing: (shelfSpacingId, value) =>
    set((state) => {
      let newShelfSpacings = state.shelfSpacings;
      if (value < 50) value = 50;

      let spaceToDistribute = value - state.shelfSpacings[shelfSpacingId - 1];

      if (spaceToDistribute > 0) {
        let shelfSpacingMoveId =
          shelfSpacingId == newShelfSpacings.length ? -1 : 1;
        for (
          let nextShelfSpacingId = shelfSpacingId + shelfSpacingMoveId;
          nextShelfSpacingId <= newShelfSpacings.length &&
          nextShelfSpacingId > 0;
          nextShelfSpacingId += shelfSpacingMoveId
        ) {
          if (spaceToDistribute > 0) {
            let nextShelfSpacingValue = Math.max(
              state.shelfSpacings[nextShelfSpacingId - 1] - spaceToDistribute,
              50,
            );
            let distributedSpace =
              state.shelfSpacings[nextShelfSpacingId - 1] -
              nextShelfSpacingValue;
            newShelfSpacings[nextShelfSpacingId - 1] = nextShelfSpacingValue;
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
