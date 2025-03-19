"use client";

import { useEffect } from "react";

import styles from "./page.module.scss";
import { useProjectsStore } from "store/projectsStore";
import { useFilterStore } from "store/filterStore";
import HorizontalTable from "components/HorizontalTable";

export default function Home() {
    const projectsStore = useProjectsStore();
    const filterStore = useFilterStore();

    const header = [
        {
            name: "Тип препака",
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
            name: "Создание",
            param: "created",
            type: "date",
            width: "150px",
        },
        {
            name: "Обновление",
            param: "updated",
            type: "date",
            width: "150px",
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
        let dataEl = {
            id: Number(prepackTypeId),
            name: prepackType.name,
            delete: true,
            copy: true,
            created: prepackType.created,
            updated: prepackType.updated,
        };

        data.push(dataEl);
    }
    data.push({
        id: "add",
    });

    useEffect(() => {
        projectsStore.initPrepackTypes();
        filterStore.setFields(header, ["created", "updated"]);
    }, []);

    return (
        <main>
            <div className={styles.table}>
                <HorizontalTable data={data} header={header} />
            </div>
        </main>
    );
}
