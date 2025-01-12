"use client";
import { create } from "zustand";
import {
    createProject,
    deleteProject,
    changeProject,
    createPrepack,
    deletePrepack,
    changePrepack,
    createShelf,
    deleteShelf,
    changeShelf,
    createRow,
    deleteRow,
    changeRow,
    createPrepackType,
    deletePrepackType,
    changePrepackType,
} from "api/projectsApi";

import {
    initProject,
    initRow,
    initShelf,
    initPrepack,
    initPrepackType,
} from "constants/initValues";

const reg = /^-?\d*(\.\d*)?$/;

export const useProjectsStore = create((set) => ({
    projects: [{ ...initProject }],
    prepacks: [{ ...initPrepack }],
    shelves: [{ ...initShelf }],
    rows: [{ ...initRow }],
    prepackTypes: [{ ...initPrepackType }],

    createProject: (clientId) => {
        set((state) => {
            let projects = state.projects;
            let project = { ...initProject };

            project.clientId = clientId;
            project = createProject(project);
            projects.push(project);

            return {
                projects: projects,
            };
        });
    },
    deleteProject: (id) => {
        set((state) => {
            let projects = state.projects.filter(
                (project) => project.id !== id,
            );
            deleteProject(id);
            return {
                projects: projects,
            };
        });
    },
    changeProject: (id, param, value, type) => {
        set((state) => {
            const reg = /^-?\d*(\.\d*)?$/;
            let projects = state.projects;
            let project = projects.find((project) => project.id == id);

            let realValue = project[param];

            if (type == "number" && reg.test(value)) realValue = Number(value);
            if (type == "text" || type == "select" || type == "file")
                realValue = value;

            project[param] = realValue;
            changeProject(id, project);

            return {
                projects: projects,
            };
        });
    },

    createPrepack: (projectId) => {
        set((state) => {
            let prepacks = state.prepacks;
            let prepack = { ...initPrepack };

            prepack.projectId = projectId;
            prepack = createPrepack(prepack);
            prepacks.push(prepack);

            return {
                prepacks: prepacks,
            };
        });
    },
    deletePrepack: (id) => {
        set((state) => {
            let prepacks = state.prepacks.filter(
                (prepack) => prepack.id !== id,
            );
            deletePrepack(id);
            return {
                prepacks: prepacks,
            };
        });
    },
    changePrepack: (id, param, value, type) => {
        set((state) => {
            const reg = /^-?\d*(\.\d*)?$/;
            let prepacks = state.prepacks;
            let prepack = prepacks.find((prepack) => prepack.id == id);

            let realValue = prepack[param];

            if ((type == "number" || type == "select") && reg.test(value))
                realValue = Number(value);
            if (type == "text" || type == "file") realValue = value;

            prepack[param] = realValue;
            changePrepack(id, prepack);

            return {
                prepacks: prepacks,
            };
        });
    },

    createShelf: (projectId) => {
        set((state) => {
            console.log(projectId);
            let shelves = state.shelves;
            let shelf = { ...initShelf };

            shelf.projectId = projectId;
            shelf = createShelf(shelf);
            shelves.push(shelf);

            return {
                shelves: shelves,
            };
        });
    },
    deleteShelf: (id) => {
        set((state) => {
            let shelves = state.shelves.filter((shelf) => shelf.id !== id);
            deleteShelf(id);
            return {
                shelves: shelves,
            };
        });
    },
    changeShelf: (id, param, value, type) => {
        set((state) => {
            const reg = /^-?\d*(\.\d*)?$/;
            let shelves = state.shelves;
            let shelf = shelves.find((shelf) => shelf.id == id);

            let realValue = shelf[param];

            if (type == "number" && reg.test(value)) realValue = Number(value);
            if (type == "text" || type == "select" || type == "file")
                realValue = value;

            shelf[param] = realValue;
            changeShelf(id, shelf);

            return {
                shelves: shelves,
            };
        });
    },

    createRow: (shelfId) => {
        set((state) => {
            let rows = state.rows;
            let row = { ...initRow };

            row.shelfId = shelfId;
            row = createRow(row);
            rows.push(row);

            return { rows };
        });
    },
    deleteRow: (id) => {
        set((state) => {
            let rows = state.rows.filter((row) => row.id !== id);
            deleteRow(id);
            return {
                rows: rows,
            };
        });
    },
    changeRow: (id, param, value, type) => {
        set((state) => {
            const reg = /^-?\d*(\.\d*)?$/;
            let rows = state.rows;
            let row = rows.find((row) => row.id == id);

            let realValue = row[param];

            if (type == "number" && reg.test(value)) realValue = Number(value);
            if (type == "text" || type == "select" || type == "file")
                realValue = value;

            row[param] = realValue;
            changeRow(id, row);

            return {
                rows: rows,
            };
        });
    },

    createPrepackType: (projectId) => {
        set((state) => {
            let prepackTypes = state.prepackTypes;
            let prepackType = { ...initPrepackType };

            prepackType = createPrepackType(prepackType);
            prepackTypes.push(prepackType);

            return {
                prepackTypes: prepackTypes,
            };
        });
    },
    deletePrepackType: (id) => {
        set((state) => {
            let prepackTypes = state.prepackTypes.filter(
                (prepackType) => prepackType.id !== id,
            );
            deletePrepackType(id);
            return {
                prepackTypes: prepackTypes,
            };
        });
    },
    changePrepackType: (id, param, value, type) => {
        set((state) => {
            const reg = /^-?\d*(\.\d*)?$/;
            let prepackTypes = state.prepackTypes;
            let prepackType = prepackTypes.find(
                (prepackType) => prepackType.id == id,
            );

            let realValue = prepackType[param];

            if (type == "number" && reg.test(value)) realValue = Number(value);
            if (type == "text" || type == "select" || type == "file")
                realValue = value;

            prepackType[param] = realValue;
            changePrepackType(id, prepackType);

            return {
                prepackTypes: prepackTypes,
            };
        });
    },
}));
