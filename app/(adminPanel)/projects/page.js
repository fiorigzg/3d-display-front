"use client";

import { useEffect, useState } from "react";

import styles from "./page.module.scss";
import { useProjectsStore } from "store/projectsStore";
import { useClientsStore } from "store/clientsStore";
import { useFilterStore } from "store/filterStore";
import HorizontalTable from "components/HorizontalTable";
import getOptions from "components/getOptions";
import isFiltred from "components/isFiltred";

export default function Home() {
  const projectsStore = useProjectsStore();
  const clientsStore = useClientsStore();
  const filterStore = useFilterStore();

  const header = [
    {
      name: "Клиент",
      param: "clientId",
      type: "id",
      width: "100px",
    },
    {
      name: "Создание клиента",
      param: "clientCreated",
      type: "date",
      width: "200px",
    },
    {
      name: "Обновление клиента",
      param: "clientUpdated",
      type: "date",
      width: "200px",
    },
    {
      name: "Имя клиента",
      param: "clientName",
      type: "const",
      width: "200px",
    },
    {
      name: "Предпроект",
      param: "projectId",
      type: "id",
      width: "120px",
      onAdd: (ids) => projectsStore.createProject(ids.clientId),
    },
    {
      name: "Создание предпроекта",
      param: "projectCreated",
      type: "date",
      width: "200px",
    },
    {
      name: "Обновление предпроекта",
      param: "projectUpdated",
      type: "date",
      width: "220px",
    },
    {
      name: "Номер предпроекта",
      param: "projectNumber",
      type: "input",
      width: "170px",
      onEnter: (ids, value) =>
        projectsStore.changeProject(
          ids.clientId,
          ids.projectId,
          "number",
          value,
          "text",
          true
        ),
    },
    {
      name: "Название предпроекта",
      param: "projectName",
      type: "input",
      width: "200px",
      onEnter: (ids, value) =>
        projectsStore.changeProject(
          ids.clientId,
          ids.projectId,
          "name",
          value,
          "text",
          true
        ),
    },
    {
      name: "Препак",
      param: "prepackId",
      type: "id",
      width: "100px",
      onAdd: (ids) => projectsStore.createPrepack(ids.projectId),
    },
    {
      name: "Создание препака",
      param: "prepackCreated",
      type: "date",
      width: "200px",
    },
    {
      name: "Обновление препака",
      param: "prepackUpdated",
      type: "date",
      width: "200px",
    },
    {
      name: "Номер препака",
      param: "prepackNumber",
      type: "input",
      width: "170px",
      onEnter: (ids, value) =>
        projectsStore.changePrepack(
          ids.projectId,
          ids.prepackId,
          "number",
          value,
          "text",
          true
        ),
    },
    {
      name: "Название препака",
      param: "prepackName",
      type: "input",
      width: "200px",
      onEnter: (ids, value) =>
        projectsStore.changePrepack(
          ids.projectId,
          ids.prepackId,
          "name",
          value,
          "text",
          true
        ),
    },
    {
      name: "Тип препака",
      param: "prepackTypeId",
      type: "select",
      options: getOptions(projectsStore.prepackTypes),
      width: "250px",
      onSelect: (ids, value) =>
        projectsStore.changePrepack(
          ids.projectId,
          ids.prepackId,
          "prepackTypeId",
          value,
          "number",
          true
        ),
    },
    {
      name: "Удалить",
      param: "delete",
      type: "button",
      icon: "delete",
      width: "50px",
      onClick: (ids) => {
        if (ids.prepackId) {
          projectsStore.deletePrepack(ids.projectId, ids.prepackId);
        } else if (ids.projectId) {
          projectsStore.deleteProject(ids.clientId, ids.projectId);
        }
      },
    },
    {
      name: "Копировать",
      param: "copy",
      type: "button",
      icon: "copy",
      width: "50px",
      onClick: (ids) => {
        if (ids.prepackId) {
          projectsStore.copyPrepack(ids.projectId, ids.prepackId);
        } else if (ids.projectId) {
          projectsStore.copyProject(ids.clientId, ids.projectId);
        }
      },
    },
    {
      name: "Проектировать",
      param: "design",
      type: "button",
      icon: "next",
      width: "50px",
      onClick: (ids) => {
        window.open(`/prepack?id=${ids.prepackId}&clientId=${ids.clientId}`);
      },
    },
  ];

  let data = [];
  let clients = clientsStore.clients;

  for (const clientId in clients) {
    const client = clients[clientId];
    const clientEl = {
      clientId: clientId,
      clientName: client.name,
      clientCreated: client.created,
      clientUpdated: client.updated,
      uniqueId: `client-${clientId}`,
      children: [],
    };

    const projects = projectsStore.projects[clientId];
    for (const projectId in projects) {
      const project = projects[projectId];
      console.log(project.number, project.name)
      const projectEl = {
        projectId: projectId,
        projectName: project.name,
        projectNumber: project.number,
        delete: true,
        copy: true,
        projectCreated: project.created,
        projectUpdated: project.updated,
        uniqueId: `project-${projectId}`,
        children: [],
      };

      const prepacks = projectsStore.prepacks[projectId];
      for (const prepackId in prepacks) {
        const prepack = prepacks[prepackId];
        const prepackEl = {
          prepackId: prepackId,
          prepackName: prepack.name,
          prepackTypeId: prepack.prepackTypeId,
          prepackNumber: prepack.number,
          delete: true,
          copy: true,
          design: !prepackId.startsWith("$"),
          prepackCreated: prepack.created,
          prepackUpdated: prepack.updated,
          uniqueId: `prepack-${prepackId}`,
        };

        projectEl.children.push(prepackEl);
      }
      projectEl.children.push({ prepackId: "add" });
      clientEl.children.push(projectEl);
    }
    data.push(clientEl);
    clientEl.children.push({ projectId: "add" });
  }

  useEffect(() => {
    clientsStore.initClients();
    projectsStore.initPrepackTypes();
    projectsStore.getAllProjects();
    projectsStore.getAllPrepacks();
    filterStore.setFields(header, ["clientCreated", "clientUpdated"]);
  }, []);
  useEffect(() => {
    filterStore.setSelectOptions({
      prepackTypeId: getOptions(projectsStore.prepackTypes),
    });
  }, [projectsStore.prepackTypes]);

  return (
    <main>
      <div className={styles.table}>
        <HorizontalTable data={data} header={header} name="projects" />
      </div>
    </main>
  );
}
