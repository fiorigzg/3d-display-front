"use client";

import { useEffect } from "react";

import styles from "./page.module.scss";
import { useProjectsStore } from "store/projectsStore";
import HorizontalTable from "components/HorizontalTable";

export default function Home() {
    const projectsStore = useProjectsStore();

    useEffect(() => {
        projectsStore.initPrepackTypes();
    });

    const header = [
        {
            name: "Сотрудник",
            param: "id",
            type: "id",
            width: "100px",
            onAdd: (ids) => projectsStore.createPrepackType(),
        },
        {
            name: "Удаление",
            type: "button",
            icon: "delete",
            param: "delete",
            width: "50px",
            onClick: (ids) => projectsStore.deletePrepackType(ids.id),
        },
        {
            name: "Копирование",
            type: "button",
            icon: "copy",
            param: "copy",
            width: "50px",
            onClick: (ids) => projectsStore.copyPrepackType(ids.id),
        },
        {
            name: "Название",
            param: "name",
            type: "input",
            isNumber: false,
            width: "calc(100% - 200px)",
            minWidth: "300px",
            onEnter: (ids, value) =>
                projectsStore.changePrepackType(
                    ids.id,
                    "name",
                    value,
                    "text",
                    true,
                ),
        },
    ];

    let data = [];
    for (const prepackTypeId in projectsStore.prepackTypes) {
        const prepackType = projectsStore.prepackTypes[prepackTypeId];
        data.push({
            id: prepackTypeId,
            name: prepackType.name,
            delete: true,
            copy: true,
        });
    }
    data.push({
        id: "add",
    });

    return (
        <main>
            <div className={styles.workingSpace}>
                <HorizontalTable data={data} header={header} />
            </div>
        </main>
    );
}
