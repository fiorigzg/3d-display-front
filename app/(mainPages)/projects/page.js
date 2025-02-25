"use client";

import { useEffect, useState } from "react";
import { Button, Input, Select, Typography } from "antd";
import { PlusOutlined, DeleteOutlined } from "@ant-design/icons";

import styles from "./page.module.scss";
import { useProjectsStore } from "store/projectsStore";
import { useClientsStore } from "store/clientsStore";
import HorizontalTable from "components/HorizontalTable";

const { Text } = Typography;

export default function Home() {
    const projectsStore = useProjectsStore();
    const clientsStore = useClientsStore();

    const [extendedClients, setExtendedClients] = useState({});
    const [extendedProjects, setExtendedProjects] = useState({});

    useEffect(() => {
        clientsStore.initClients();
        projectsStore.initPrepackTypes();
    }, []);

    let prepackTypeOptions = {};
    for (const prepackTypeId in projectsStore.prepackTypes) {
        const prepackType = projectsStore.prepackTypes[prepackTypeId];
        prepackTypeOptions[prepackTypeId] = prepackType.name;
    }

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
            name: "Номер предпроекта",
            param: "projectNumber",
            type: "const",
            width: "170px",
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
            name: "Препак",
            param: "prepackId",
            type: "id",
            width: "100px",
            onAdd: (ids) => projectsStore.createPrepack(ids.projectId),
        },
        {
            name: "Номер препака",
            param: "prepackNumber",
            type: "const",
            width: "170px",
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
            options: prepackTypeOptions,
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
        data.push({
            clientId: clientId,
            clientName: client.name,
        });

        if (extendedClients[clientId]) {
            let projects = projectsStore.projects[clientId] || {};
            for (const projectId in projects) {
                const project = projects[projectId];
                data.push({
                    projectId: projectId,
                    projectName: project.name,
                    projectNumber: 0,
                    delete: true,
                    copy: true,
                });

                if (extendedProjects[projectId]) {
                    let prepacks = projectsStore.prepacks[projectId] || {};
                    for (const prepackId in prepacks) {
                        const prepack = prepacks[prepackId];
                        data.push({
                            prepackId: prepackId,
                            prepackName: prepack.name,
                            prepackTypeId: prepack.prepackTypeId,
                            prepackNumber: prepack.number,
                            delete: true,
                            copy: true,
                            design: true,
                        });
                    }
                    data.push({ prepackId: "add" });
                }
            }
            data.push({ projectId: "add" });
        }
    }

    return (
        <main>
            <div className={styles.workingSpace}>
                <HorizontalTable data={data} header={header} />
            </div>
        </main>
    );
}
