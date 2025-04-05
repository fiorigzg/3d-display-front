"use member";

import { runSequence } from "api/commonApi";
import { models } from "constants/fields";
import { reloadOnSave } from "constants/main";

import { create } from "zustand";

export const useSaveStore = create((set, get) => ({
  sequence: [],

  createOne: async (name, id, json, fields) => {
    set((state) => {
      let createString = "";
      for (const field in json) {
        if (field != "id") {
          if (createString != "") createString += "&& ";
          createString += `${fields[field]}=${json[field]}`;
        }
      }
      return {
        sequence: [
          ...state.sequence,
          `create ${models[name]} ${id} fields ${createString}`,
        ],
      };
    });
  },

  deleteOne: async (name, id) => {
    set((state) => {
      return {
        sequence: [...state.sequence, `delete ${models[name]} ${id}`],
      };
    });
  },

  changeOne: async (name, id, changes, fields) => {
    set((state) => {
      let changesString = "";
      for (const field in changes) {
        if (field != "id") {
          if (changesString != "") changesString += "&& ";
          changesString += `${fields[field]}=${changes[field]}`;
        }
      }
      console.log(state.sequence);
      return {
        sequence: [
          ...state.sequence,
          `change ${models[name]} ${id} fields ${changesString}`,
        ],
      };
    });
  },

  copyOne: async (name, id, ids) => {
    set((state) => {
      let idsString = "";
      for (const copyObj in ids) {
        const newId = ids[copyObj];
        const [modelName, oldId] = copyObj.split("-");
        if (idsString != "") idsString += "&& ";
        idsString += `${models[modelName]}_${oldId}=${newId}`;
      }
      console.log(state.sequence);
      return {
        sequence: [
          ...state.sequence,
          `copy ${models[name]} ${id} created ${idsString}`,
        ],
      };
    });
  },

  save: async () => {
    await runSequence(get().sequence);
    if (reloadOnSave) window.location.reload();
  },
}));
