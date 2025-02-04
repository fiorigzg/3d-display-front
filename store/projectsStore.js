"use client";

import structuredClone from "@ungap/structured-clone";
import { create } from "zustand";

import {
    initProject,
    initPrepack,
    initShelf,
    initRow,
    initPrepackType,
} from "constants/initValues";
import {
    prepackTypeFields,
    projectFields,
    prepackFields,
    shelfFields,
} from "constants/fields";
import {
    getAll,
    createOne,
    copyOne,
    deleteOne,
    checkValueType,
    changeOne,
} from "api/common";

export const useProjectsStore = create((set, get) => ({
    projects: {},
    prepacks: {},
    shelves: {},
    prepackTypes: {},

    initProjects: async (clientId) => {
        let projects = await getAll("/projects", "projects", projectFields);
        for (const projectId in projects) {
            const project = projects[projectId];
            if (project.clientId != clientId) delete projects[projectId];
        }

        set((state) => {
            return { projects: { ...state.projects, [clientId]: projects } };
        });
    },
    createProject: async (clientId) => {
        let project = { ...initProject, clientId };
        let id = await createOne(
            "/create_project",
            "project_id",
            project,
            projectFields,
        );

        set((state) => {
            console.log({
                ...state.projects,
                [clientId]: { ...state.projects[clientId], [id]: project },
            });
            return {
                projects: {
                    ...state.projects,
                    [clientId]: { ...state.projects[clientId], [id]: project },
                },
            };
        });
    },
    copyProject: async (clientId, id) => {
        const copiedId = await copyOne(`/project_${id}`, projectFields);

        set((state) => {
            let projects = state.projects;
            const project = structuredClone(projects[clientId][id]);
            projects[clientId][copiedId] = project;

            return {
                projects: projects,
            };
        });
    },
    deleteProject: async (clientId, id) => {
        await deleteOne(`/project_${id}`);

        set((state) => {
            let projects = state.projects[clientId];
            delete projects[id];
            return { projects: { ...state.projects, [clientId]: projects } };
        });
    },
    changeProject: async (clientId, id, param, value, type, isReq) => {
        let realValue = checkValueType(value, type);
        if (realValue != null) {
            if (isReq)
                await changeOne(
                    `/project_${id}`,
                    { [param]: realValue },
                    projectFields,
                );

            set((state) => {
                let projects = state.projects[clientId];
                console.log(projects, id);
                let project = projects[id];
                project[param] = realValue;
                return {
                    projects: { ...state.projects, [clientId]: projects },
                };
            });
        }
    },

    initPrepacks: async (projectId) => {
        const prepacks = await getAll(
            `/poultice?project_id=${projectId}`,
            "poultices",
            prepackFields,
        );

        set((state) => {
            return { prepacks: { ...state.prepacks, [projectId]: prepacks } };
        });
    },
    createPrepack: async (projectId) => {
        let prepack = {
            ...initPrepack,
            projectId: projectId,
        };
        let id = await createOne(
            "/poultice",
            "poultice_id",
            prepack,
            prepackFields,
        );

        set((state) => {
            return {
                prepacks: {
                    ...state.prepacks,
                    [projectId]: {
                        ...state.prepacks[projectId],
                        [id]: prepack,
                    },
                },
            };
        });
    },
    copyPrepack: async (projectId, id) => {
        const copiedId = await copyOne(`/prepack_${id}`, prepackFields);

        set((state) => {
            let prepacks = state.prepacks;
            let prepack = { ...prepacks[projectId][id] };
            prepacks[projectId][copiedId] = prepack;
            return {
                prepacks: prepacks,
            };
        });
    },
    deletePrepack: async (projectId, id) => {
        await deleteOne(`/poultice_${id}`);

        set((state) => {
            let prepacks = state.prepacks[projectId];
            delete prepacks[id];
            return { prepacks: { ...state.prepacks, [projectId]: prepacks } };
        });
    },
    changePrepack: async (projectId, prepackId, param, value, type, isReq) => {
        let realValue = checkValueType(value, type);
        if (realValue != null) {
            if (isReq)
                await changeOne(
                    `/poultice_${prepackId}`,
                    { [param]: realValue },
                    prepackFields,
                );

            set((state) => {
                let prepacks = state.prepacks[projectId];
                let prepack = prepacks[prepackId];
                prepack[param] = realValue;
                return {
                    prepacks: { ...state.prepacks, [projectId]: prepacks },
                };
            });
        }
    },

    initShelves: async (prepackId) => {
        const shelves = await getAll(
            `/shelves?poultice_id=${prepackId}`,
            "shelves",
            shelfFields,
        );

        console.log(shelves);

        set((state) => {
            return { shelves: { ...state.shelves, [prepackId]: shelves } };
        });
    },
    createShelf: async (prepackId) => {
        let shelf = { ...initShelf, prepackId };
        let id = await createOne("/shelf", "shelf_id", shelf, shelfFields);

        set((state) => {
            return {
                shelves: {
                    ...state.shelves,
                    [prepackId]: { ...state.shelves[prepackId], [id]: shelf },
                },
            };
        });
    },
    copyShelf: async (prepackId, id) => {
        const copiedId = await copyOne(`/shelf_${id}`, shelfFields);

        set((state) => {
            let shelves = state.shelves;
            let shelf = { ...shelves[prepackId][id] };
            shelves[prepackId][copiedId] = shelf;
            return {
                shelves: shelves,
            };
        });
    },
    deleteShelf: async (prepackId, id) => {
        await deleteOne(`/shelf_${id}`);

        set((state) => {
            let shelves = state.shelves[prepackId];
            delete shelves[id];
            return { shelves: { ...state.shelves, [prepackId]: shelves } };
        });
    },
    changeShelf: async (prepackId, id, param, value, type, isReq) => {
        let realValue = checkValueType(value, type);
        if (realValue != null) {
            if (isReq)
                await changeOne(
                    `/shelf_${id}`,
                    { [param]: realValue },
                    shelfFields,
                );

            set((state) => {
                let shelves = state.shelves[prepackId];
                console.log(state.shelves, prepackId, shelves, id);
                let shelf = shelves[id];
                shelf[param] = realValue;
                return { shelves: { ...state.shelves, [prepackId]: shelves } };
            });
        }
    },

    changeRow: async (prepackId, shelfId, rowId, param, value, type, isReq) => {
        let realValue = checkValueType(value, type);
        if (realValue != null) {
            let shelves = get().shelves[prepackId];
            let shelf = shelves[shelfId];
            let row = shelf.rows[rowId];
            row[param] = realValue;

            if (isReq)
                await changeOne(
                    `/shelf_${shelfId}`,
                    { rows: shelf.rows },
                    shelfFields,
                );

            set((state) => {
                return { shelves: { ...state.shelves, [prepackId]: shelves } };
            });
        }
    },
    createRow: async (prepackId, shelfId) => {
        let shelves = get().shelves[prepackId];
        let shelf = shelves[shelfId];
        let rows = shelf.rows;
        let rowId = Object.keys(rows).length;
        let newRow = { ...initRow };
        rows[rowId] = newRow;

        await changeOne(`/shelf_${shelfId}`, { rows: rows }, shelfFields);

        set((state) => {
            return { shelves: { ...state.shelves, [prepackId]: shelves } };
        });
    },
    copyRow: async (prepackId, shelfId, id) => {
        console.log("Copy row");
    },
    deleteRow: async (prepackId, shelfId, id) => {
        let shelves = get().shelves[prepackId];
        let shelf = shelves[shelfId];
        let rows = shelf.rows;

        rows = Object.keys(rows)
            .filter((objKey) => objKey !== id)
            .reduce((newObj, key) => {
                newObj[key] = rows[key];
                return newObj;
            }, {});

        let newRowsArr = [];
        for (let newRowId in rows) {
            newRowsArr.push({ ...rows[newRowId], id: newRowId });
        }

        await changeOne(`/shelf_${shelfId}`, { rows: newRowsArr }, shelfFields);

        set((state) => {
            return { shelves: { ...state.shelves, [prepackId]: shelves } };
        });
    },

    initPrepackTypes: async () => {
        const prepackTypes = await getAll(
            "/preptypes",
            "preptypes",
            prepackTypeFields,
        );

        set((state) => {
            return { prepackTypes: prepackTypes };
        });
    },
    createPrepackType: async () => {
        let prepackType = { ...initPrepackType };
        let id = await createOne(
            "/preptype",
            "preptype_id",
            prepackType,
            prepackTypeFields,
        );

        set((state) => {
            let prepackTypes = state.prepackTypes;
            prepackTypes[id] = prepackType;
            return {
                prepackTypes: prepackTypes,
            };
        });
    },
    copyPrepackType: async (id) => {
        const copiedId = await copyOne(`/preptype_${id}`, prepackTypeFields);

        set((state) => {
            let prepackTypes = state.prepackTypes;
            let prepackType = { ...prepackTypes[id] };
            prepackTypes[copiedId] = prepackType;
            return {
                prepackTypes: prepackTypes,
            };
        });
    },
    deletePrepackType: async (id) => {
        await deleteOne(`/preptype_${id}`);

        set((state) => {
            let prepackTypes = state.prepackTypes;
            delete prepackTypes[id];
            return {
                prepackTypes: prepackTypes,
            };
        });
    },
    changePrepackType: async (id, param, value, type, isReq) => {
        let realValue = checkValueType(value, type);
        if (realValue != null) {
            if (isReq)
                await changeOne(
                    `/preptype_${id}`,
                    { [param]: realValue },
                    prepackTypeFields,
                );

            set((state) => {
                let prepackTypes = state.prepackTypes;
                let prepackType = prepackTypes[id];
                prepackType[param] = realValue;
                return {
                    prepackTypes: prepackTypes,
                };
            });
        }
    },
}));
