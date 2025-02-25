"use client";

import { useEffect } from "react";

import styles from "./page.module.scss";
import { useClientsStore } from "store/clientsStore";
import HorizontalTable from "components/HorizontalTable";

export default function Home() {
    const clientsStore = useClientsStore();

    useEffect(() => {
        clientsStore.initClients();
    }, []);

    const header = [
        {
            name: "Клиент",
            param: "id",
            type: "id",
            width: "100px",
            onAdd: (ids) => clientsStore.createClient(),
        },
        {
            name: "Удаление",
            type: "button",
            icon: "delete",
            param: "delete",
            width: "50px",
            onClick: (ids) => clientsStore.deleteClient(ids.id),
        },
        {
            name: "Копирование",
            type: "button",
            icon: "copy",
            param: "copy",
            width: "50px",
            onClick: (ids) => clientsStore.copyClient(ids.id),
        },
        {
            name: "Название",
            param: "name",
            type: "input",
            isNumber: false,
            width: "calc(100% - 200px)",
            minWidth: "300px",
            onEnter: (ids, value) =>
                clientsStore.changeClient(ids.id, "name", value, "text", true),
        },
    ];

    let data = [];
    for (const clientId in clientsStore.clients) {
        const client = clientsStore.clients[clientId];
        data.push({
            id: clientId,
            name: client.name,
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
