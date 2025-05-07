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
import { getAll, checkValueType } from "api/commonApi";
import { useSaveStore } from "./saveStore";

export const useProjectsStore = create((set, get) => ({
  projects: {},
  newProjectId: 0,
  prepacks: {},
  newPrepackId: 0,
  prepackTypes: {},
  newPrepackTypeId: 0,

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
    const newProjectId = get().newProjectId + 1;
    await useSaveStore
      .getState()
      .createOne("project", "$" + newProjectId, project, projectFields);

    set((state) => {
      return {
        newProjectId: newProjectId,
        projects: {
          ...state.projects,
          [clientId]: {
            ...state.projects[clientId],
            ["$" + newProjectId]: project,
          },
        },
      };
    });
  },
  copyProject: async (clientId, id) => {
    const newProjectId = get().newProjectId + 1;
    let newPrepackId = get().newPrepackId + 1;
    let newPrepacks = get().prepacks;
    const prepacksToCopy = newPrepacks[id];

    let copyIds = { [`project-${id}`]: "$" + newProjectId };

    newPrepacks["$" + newProjectId] = {};
    for (const prepackId in prepacksToCopy) {
      copyIds[`prepack-${prepackId}`] = "$" + newPrepackId;
      newPrepacks["$" + newProjectId]["$" + newPrepackId] = {
        ...prepacksToCopy[prepackId],
      };
      newPrepackId++;
    }

    await useSaveStore.getState().copyOne("project", id, copyIds);

    set((state) => {
      return {
        newProjectId: newProjectId,
        newPrepackId: newPrepackId,
        projects: {
          ...state.projects,
          [clientId]: {
            ...state.projects[clientId],
            ["$" + newProjectId]: state.projects[clientId][id],
          },
        },
        prepacks: newPrepacks,
      };
    });
  },
  deleteProject: async (clientId, id) => {
    await useSaveStore.getState().deleteOne("project", id);

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
        await useSaveStore
          .getState()
          .changeOne("project", id, { [param]: realValue }, projectFields);

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
    let newPrepackId = get().newPrepackId + 1;
    await useSaveStore
      .getState()
      .createOne("prepack", "$" + newPrepackId, prepack, prepackFields);

    set((state) => {
      return {
        newPrepackId: newPrepackId,
        prepacks: {
          ...state.prepacks,
          [projectId]: {
            ...state.prepacks[projectId],
            ["$" + newPrepackId]: prepack,
          },
        },
      };
    });
  },
  copyPrepack: async (projectId, id) => {
    const newPrepackId = get().newPrepackId + 1;
    await useSaveStore
      .getState()
      .copyOne("prepack", id, { [`prepack-${id}`]: "$" + newPrepackId });

    set((state) => {
      let prepacks = state.prepacks;
      prepacks[projectId]["$" + newPrepackId] = {
        ...prepacks[projectId][id],
      };
      return {
        prepacks: prepacks,
        newPrepackId: newPrepackId,
      };
    });
  },
  deletePrepack: async (projectId, id) => {
    await useSaveStore.getState().deleteOne("prepack", id);

    set((state) => {
      let prepacks = state.prepacks[projectId];
      delete prepacks[id];
      return { prepacks: { ...state.prepacks, [projectId]: prepacks } };
    });
  },
  changePrepack: async (projectId, id, param, value, type, isReq) => {
    let realValue = checkValueType(value, type);
    if (realValue != null) {
      if (isReq)
        await useSaveStore
          .getState()
          .changeOne("prepack", id, { [param]: realValue }, prepackFields);

      set((state) => {
        let prepacks = state.prepacks[projectId];
        let prepack = prepacks[id];
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
    const newPrepackTypeId = get().newPrepackTypeId + 1;
    await useSaveStore
      .getState()
      .createOne(
        "prepackType",
        "$" + newPrepackTypeId,
        prepackType,
        prepackTypeFields,
      );

    set((state) => {
      let prepackTypes = state.prepackTypes;
      prepackTypes["$" + newPrepackTypeId] = prepackType;
      return {
        newPrepackTypeId: newPrepackTypeId,
        prepackTypes: prepackTypes,
      };
    });
  },
  copyPrepackType: async (id) => {
    const newPrepackTypeId = get().newPrepackTypeId + 1;
    await useSaveStore.getState().copyOne("prepackType", id, {
      [`prepackType-${id}`]: "$" + newPrepackTypeId,
    });

    set((state) => {
      let prepackTypes = state.prepackTypes;
      prepackTypes["$" + newPrepackTypeId] = { ...prepackTypes[id] };
      return {
        prepackTypes: prepackTypes,
        newPrepackTypeId: newPrepackTypeId,
      };
    });
  },
  deletePrepackType: async (id) => {
    await useSaveStore.getState().deleteOne("prepackType", id);

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
        await useSaveStore
          .getState()
          .changeOne(
            "prepackType",
            id,
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
