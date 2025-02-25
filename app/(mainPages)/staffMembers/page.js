"use client";

import { useEffect } from "react";

import styles from "./page.module.scss";
import { useStaffStore } from "store/staffStore";
import HorizontalTable from "components/HorizontalTable";

export default function Home() {
    const staffStore = useStaffStore();

    useEffect(() => {
        staffStore.initMembers();
    }, []);

    const header = [
        {
            name: "Сотрудник",
            param: "id",
            type: "id",
            width: "100px",
            onAdd: (ids) => staffStore.createMember(),
        },
        {
            name: "Удаление",
            type: "button",
            icon: "delete",
            param: "delete",
            width: "50px",
            onClick: (ids) => staffStore.deleteMember(ids.id),
        },
        {
            name: "Копирование",
            type: "button",
            icon: "copy",
            param: "copy",
            width: "50px",
            onClick: (ids) => staffStore.copyMember(ids.id),
        },
        {
            name: "Название",
            param: "name",
            type: "input",
            isNumber: false,
            width: "calc(100% - 200px)",
            minWidth: "300px",
            onEnter: (ids, value) =>
                staffStore.changeMember(ids.id, "name", value, "text", true),
        },
    ];

    let data = [];
    for (const memberId in staffStore.members) {
        const member = staffStore.members[memberId];
        data.push({
            id: memberId,
            name: member.name,
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
