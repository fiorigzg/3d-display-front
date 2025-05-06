"use client";

import { useEffect } from "react";

import styles from "./page.module.scss";
import { useClientsStore } from "store/clientsStore";
import { useFilterStore } from "store/filterStore";
import agreeMenu from "components/agreeMenu";
import HorizontalTable from "components/HorizontalTable";

export default function Home() {
  const clientsStore = useClientsStore();
  const filterStore = useFilterStore();

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
      onClick: (ids) => {
        agreeMenu(`Точно удалить клиента ${ids.id}?`, () =>
          clientsStore.deleteClient(ids.id),
        );
      },
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
        clientsStore.changeClient(ids.id, "name", value, "text", true),
    },
  ];

  let data = [];
  for (const clientId in clientsStore.clients) {
    const client = clientsStore.clients[clientId];
    const dataEl = {
      id: clientId,
      name: client.name,
      delete: true,
      copy: true,
      created: client.created,
      updated: client.updated,
    };

    data.push(dataEl);
  }
  data.push({
    id: "add",
  });

  useEffect(() => {
    clientsStore.initClients();
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
