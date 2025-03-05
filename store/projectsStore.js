"use client";

import { create } from "zustand";

import {
    initProject,
    initPrepack,
    initPrepackType,
} from "constants/initValues";
import {
    prepackTypeFields,
    projectFields,
    prepackFields,
} from "constants/fields";
import {
    getAll,
    createOne,
    copyOne,
    deleteOne,
    checkValueType,
    changeOne,
} from "api/commonApi";

export const useProjectsStore = create((set, get) => ({
    projects: {},
    prepacks: {},
    prepackTypes: {},

    getAllProjects: async () => {
        const projects = await getAll("/projects", "projects", projectFields);
        let realProjects = {};

        for (const projectId in projects) {
            const project = projects[projectId];
            if (!(project.clientId in realProjects)) {
                realProjects[project.clientId] = {};
            }
            realProjects[project.clientId][projectId] = project;
        }

        set((state) => ({
            projects: realProjects,
        }));
    },
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
            return {
                projects: {
                    ...state.projects,
                    [clientId]: { ...state.projects[clientId], [id]: project },
                },
            };
        });
    },
    copyProject: async (clientId, id) => {
        const newIds = await copyOne("project", id);
        const newId = newIds.find((el) => el.type == "project").id;

        set((state) => {
            let projects = state.projects;
            let project = { ...projects[clientId][id] };
            projects[clientId][newId] = project;
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
                let project = projects[id];
                project[param] = realValue;
                return {
                    projects: { ...state.projects, [clientId]: projects },
                };
            });
        }
    },

    getAllPrepacks: async () => {
        const prepacks = await getAll("/poultices", "poultices", prepackFields);
        let realPrepacks = {};

        for (const prepackId in prepacks) {
            const prepack = prepacks[prepackId];
            if (!(prepack.projectId in realPrepacks)) {
                realPrepacks[prepack.projectId] = {};
            }
            realPrepacks[prepack.projectId][prepackId] = prepack;
        }

        set((state) => ({
            prepacks: realPrepacks,
        }));
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
        const newIds = await copyOne("prepack", id);
        const newId = newIds.find((el) => el.type == "prepack").id;

        set((state) => {
            let prepacks = state.prepacks;
            let prepack = { ...prepacks[projectId][id] };
            prepacks[projectId][newId] = prepack;
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
