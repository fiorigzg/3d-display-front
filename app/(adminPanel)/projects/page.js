"use client";

import { useEffect, useState } from "react";
import { Button, Input, Select, Typography } from "antd";
import { PlusOutlined, DeleteOutlined } from "@ant-design/icons";

import styles from "./page.module.scss";
import { useProjectsStore } from "store/projectsStore";
import { useClientsStore } from "store/clientsStore";
import { useFilterStore } from "store/filterStore";
import HorizontalTable from "components/HorizontalTable";
import getOptions from "components/getOptions";

const { Text } = Typography;

export default function Home() {
    const projectsStore = useProjectsStore();
    const clientsStore = useClientsStore();
    const filterStore = useFilterStore();

    const [extendedClients, setExtendedClients] = useState({});
    const [extendedProjects, setExtendedProjects] = useState({});

    const header = [
        {
            name: "Клиент",
            param: "clientId",
            type: "id",
            width: "100px",
            onSwitchExtend: (clientId) => {
                if (!(clientId in extendedClients)) {
                    projectsStore.initProjects(clientId);
                    setExtendedClients({
                        ...extendedClients,
                        [clientId]: true,
                    });
                } else {
                    setExtendedClients({
                        ...extendedClients,
                        [clientId]: !extendedClients[clientId],
                    });
                }
            },
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
            width: "100px",
            onAdd: (ids) => projectsStore.createProject(ids.clientId),
            onSwitchExtend: (projectId, ids) => {
                if (!(projectId in extendedProjects)) {
                    projectsStore.initPrepacks(projectId);
                    setExtendedProjects({
                        ...extendedProjects,
                        [projectId]: true,
                    });
                } else {
                    setExtendedProjects({
                        ...extendedProjects,
                        [projectId]: !extendedProjects[projectId],
                    });
                }
            },
        },
        {
            name: "Создание предпроекта",
            param: "projectCreated",
            type: "const",
            width: "200px",
        },
        {
            name: "Номер предпроекта",
            param: "projectNumber",
            type: "input",
            width: "170px",
            onEnter: (ids, value) =>
                projectsStore.changePrepack(
                    ids.clientId,
                    ids.projectId,
                    "number",
                    value,
                    "text",
                    true,
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
                    true,
                ),
        },
        {
            name: "Создание препака",
            param: "prepackCreated",
            type: "const",
            width: "170px",
        },
        {
            name: "Препак",
            param: "prepackId",
            type: "id",
            width: "100px",
            onAdd: (ids) => projectsStore.createPrepack(ids.projectId),
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
                    true,
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
                    true,
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
                    true,
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
                window.open(
                    `/prepack?id=${ids.prepackId}&clientId=${ids.clientId}`,
                );
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
        };
        let isClientFilter =
            !(filterStore.param in clientEl) ||
            String(clientEl[filterStore.param]).includes(filterStore.value);
        let isClientDate =
            !(filterStore.dateFilter.param in client) ||
            (Date.parse(client[filterStore.dateFilter.param]) >=
                Date.parse(filterStore.dateFilter.from) &&
                Date.parse(client[filterStore.dateFilter.param]) <=
                    Date.parse(filterStore.dateFilter.to));

        if (isClientFilter && isClientDate) {
            data.push(clientEl);

            let projects = {};
            if (clientId in extendedClients && extendedClients[clientId])
                projects = projectsStore.projects[clientId] || {};
            for (const projectId in projects) {
                const project = projects[projectId];
                const projectEl = {
                    projectId: projectId,
                    projectCreated: project.created.slice(0, 10),
                    projectName: project.name,
                    projectNumber: 0,
                    delete: true,
                    copy: true,
                };
                let isProjectFilter =
                    !(filterStore.param in projectEl) ||
                    String(projectEl[filterStore.param]).includes(
                        filterStore.value,
                    );
                let isProjectDate =
                    !(filterStore.dateFilter.param in project) ||
                    (Date.parse(project[filterStore.dateFilter.param]) >=
                        Date.parse(filterStore.dateFilter.from) &&
                        Date.parse(project[filterStore.dateFilter.param]) <=
                            Date.parse(filterStore.dateFilter.to));

                if (isProjectFilter && isProjectDate) {
                    data.push(projectEl);

                    if (extendedProjects[projectId]) {
                        let prepacks = projectsStore.prepacks[projectId] || {};
                        for (const prepackId in prepacks) {
                            const prepack = prepacks[prepackId];
                            const prepackEl = {
                                prepackId: prepackId,
                                prepackCreated: prepack.created.slice(0, 10),
                                prepackName: prepack.name,
                                prepackTypeId: prepack.prepackTypeId,
                                prepackNumber: prepack.number,
                                delete: true,
                                copy: true,
                                design: true,
                            };

                            let isPrepackFilter =
                                !(filterStore.param in prepackEl) ||
                                String(prepackEl[filterStore.param]).includes(
                                    filterStore.value,
                                ) || filterStore.options.includes(
                                    prepackEl[filterStore.param],
                                );
                            let isPrepackDate =
                                !(filterStore.dateFilter.param in prepack) ||
                                (Date.parse(
                                    prepack[filterStore.dateFilter.param],
                                ) >= Date.parse(filterStore.dateFilter.from) &&
                                    Date.parse(
                                        prepack[filterStore.dateFilter.param],
                                    ) <= Date.parse(filterStore.dateFilter.to));

                            if (isPrepackFilter && isPrepackDate)
                                data.push(prepackEl);
                        }
                        if (
                            !(filterStore.param in projectEl) &&
                            "projectId" in data.at(-1) &&
                            filterStore.value != ""
                        )
                            data.pop();
                        else if (
                            projectId in extendedProjects &&
                            extendedProjects[projectId]
                        )
                            data.push({ prepackId: "add" });
                    }
                }
            }
            if (
                !(filterStore.param in clientEl) &&
                "clientId" in data.at(-1) &&
                filterStore.value != ""
            )
                data.pop();
            else if (clientId in extendedClients && extendedClients[clientId])
                data.push({ projectId: "add" });
        }
    }

    useEffect(() => {
        clientsStore.initClients();
        projectsStore.initPrepackTypes();
        filterStore.setFields(header);
    }, []);
    useEffect(() => {
        filterStore.setSelectOptions({
            prepackTypeId: getOptions(projectsStore.prepackTypes),
        });
    }, [projectsStore.prepackTypes]);

    return (
        <main>
            <div className={styles.table}>
                <HorizontalTable data={data} header={header} />
            </div>
        </main>
    );
}
