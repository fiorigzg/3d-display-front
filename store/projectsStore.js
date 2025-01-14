"use client";

import {
    initProject,
    initPrepack,
    initShelf,
    initRow,
    initPrepackType,
} from "constants/initValues";

import {
    getProjects,
    createProject,
    deleteProject,
    changeProject,
    getPrepacks,
    createPrepack,
    deletePrepack,
    changeShelfJson,
    changePrepack,
    getShelves,
    createShelf,
    deleteShelf,
    changeShelf,
    getPrepackTypes,
    createPrepackType,
    deletePrepackType,
    changePrepackType,
} from "api/projectsApi";

import { create } from "zustand";

export const useProjectsStore = create((set) => ({
    projects: [],
    prepacks: [],
    shelves: [],
    prepackTypes: [],

    initProjects: async () => {
        const projects = await getProjects();
        const prepacks = await getPrepacks();
        const shelves = await getShelves();

        set({
            projects: projects,
            prepacks: prepacks,
            shelves: shelves,
        });
    },
    initPrepackTypes: async () => {
        const prepackTypes = await getPrepackTypes();
        set({ prepackTypes: prepackTypes });
    },

    createProject: async (clientId) => {
        let project = { ...initProject };

        project.clientId = clientId;
        project = await createProject(project);

        set((state) => {
            let projects = state.projects;
            projects.push(project);

            return {
                projects: projects,
            };
        });
    },
    deleteProject: async (id) => {
        await deleteProject(id);

        set((state) => {
            let projects = state.projects.filter(
                (project) => project.id !== id,
            );
            return {
                projects: projects,
            };
        });
    },
    changeProject: async (id, param, value, type) => {
        const reg = /^-?\d*(\.\d*)?$/;
        let realValue = null;
        if (type == "number" && reg.test(value)) realValue = Number(value);
        if (type == "text" || type == "select" || type == "file")
            realValue = value;

        if (realValue != null) changeProject(id, { [param]: realValue });

        set((state) => {
            let projects = state.projects;
            let project = projects.find((project) => project.id == id);

            if (realValue != null) project[param] = realValue;

            return {
                projects: projects,
            };
        });
    },

    createPrepack: async (projectId) => {
        let prepack = { ...initPrepack };

        prepack.projectId = projectId;
        prepack = await createPrepack(prepack);

        set((state) => {
            let prepacks = state.prepacks;
            prepacks.push(prepack);

            return {
                prepacks: prepacks,
            };
        });
    },
    deletePrepack: async (id) => {
        await deletePrepack(id);

        set((state) => {
            let prepacks = state.prepacks.filter(
                (prepack) => prepack.id !== id,
            );
            return {
                prepacks: prepacks,
            };
        });
    },
    changePrepack: async (id, param, value, type) => {
        const reg = /^-?\d*(\.\d*)?$/;
        let realValue = null;
        if ((type == "number" || type == "select") && reg.test(value))
            realValue = Number(value);
        if (type == "text" || type == "file") realValue = value;

        if (realValue != null) changePrepack(id, { [param]: realValue });

        set((state) => {
            let prepacks = state.prepacks;
            let prepack = prepacks.find((prepack) => prepack.id == id);

            if (realValue != null) prepack[param] = realValue;

            return {
                prepacks: prepacks,
            };
        });
    },

    createShelf: async (prepackId) => {
        let shelf = { ...initShelf };

        shelf.prepackId = prepackId;
        shelf = await createShelf(shelf);

        set((state) => {
            let shelves = state.shelves;
            shelves.push(shelf);

            return {
                shelves: shelves,
            };
        });
    },
    deleteShelf: async (id) => {
        await deleteShelf(id);

        set((state) => {
            let shelves = state.shelves.filter((shelf) => shelf.id !== id);
            return {
                shelves: shelves,
            };
        });
    },
    changeShelf: async (id, param, value, type) => {
        const reg = /^-?\d*(\.\d*)?$/;
        let realValue = null;
        if (type == "number" && reg.test(value)) realValue = Number(value);
        if (type == "text" || type == "select" || type == "file")
            realValue = value;

        if (realValue != null) changeShelf(id, { [param]: realValue });

        set((state) => {
            let shelves = state.shelves;
            let shelf = shelves.find((shelf) => shelf.id == id);

            if (realValue != null) shelf[param] = realValue;

            return {
                shelves: shelves,
            };
        });
    },

    createRow: async (shelfId) => {
        set((state) => {
            const shelves = state.shelves.map((shelf) => {
                if (shelf.id !== shelfId) return shelf;

                const maxRowId = shelf.rows.reduce(
                    (maxId, row) => Math.max(maxId, row.id),
                    0,
                );
                const newRow = { ...initRow, id: maxRowId + 1 };
                const updatedShelf = {
                    ...shelf,
                    rows: [...shelf.rows, newRow],
                };
                return updatedShelf;
            });

            return { shelves };
        });
    },
    deleteRow: (shelfId, rowId) => {
        set((state) => {
            // Find the shelf we need to update
            const shelves = state.shelves.map((shelf) => {
                if (shelf.id !== shelfId) return shelf;

                // Filter out the row with the given rowId
                const updatedRows = shelf.rows.filter(
                    (row) => row.id !== rowId,
                );

                // Return the updated shelf
                return { ...shelf, rows: updatedRows };
            });

            // Return the new state with updated shelves
            return { shelves };
        });
    },
    changeRow: async (shelfId, rowId, param, value, type) => {
        const reg = /^-?\d*(\.\d*)?$/;
        let realValue = null;

        if (type === "number" && reg.test(value)) realValue = Number(value);
        if (["text", "select", "file"].includes(type)) realValue = value;

        if (realValue !== null) {
            set((state) => {
                const shelves = state.shelves.map((shelf) => {
                    if (shelf.id !== shelfId) return shelf;

                    const updatedRows = shelf.rows.map((row) => {
                        if (row.id !== rowId) return row;
                        return { ...row, [param]: realValue };
                    });

                    return { ...shelf, rows: updatedRows };
                });

                return { shelves };
            });
        }
    },

    createPrepackType: async () => {
        let prepackType = { ...initPrepackType };
        prepackType = await createPrepackType(prepackType);

        set((state) => {
            let prepackTypes = state.prepackTypes;
            prepackTypes.push(prepackType);

            return {
                prepackTypes: prepackTypes,
            };
        });
    },
    deletePrepackType: async (id) => {
        await deletePrepackType(id);

        set((state) => {
            let prepackTypes = state.prepackTypes.filter(
                (prepackType) => prepackType.id !== id,
            );

            return {
                prepackTypes: prepackTypes,
            };
        });
    },
    changePrepackType: async (id, param, value, type) => {
        const reg = /^-?\d*(\.\d*)?$/;
        let realValue = null;
        if (type == "number" && reg.test(value)) realValue = Number(value);
        if (type == "text" || type == "select" || type == "file")
            realValue = value;

        if (realValue != null) changePrepackType(id, { [param]: realValue });

        set((state) => {
            let prepackTypes = state.prepackTypes;
            let prepackType = prepackTypes.find(
                (prepackType) => prepackType.id === id,
            );

            if (realValue != null) prepackType[param] = realValue;

            return {
                prepackTypes: prepackTypes,
            };
        });
    },
}));
