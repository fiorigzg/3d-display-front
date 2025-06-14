"use client";

import { useEffect } from "react";

import styles from "./page.module.scss";
import { useStaffStore } from "store/staffStore";
import { useFilterStore } from "store/filterStore";
import HorizontalTable from "components/HorizontalTable";

export default function Home() {
  const staffStore = useStaffStore();
  const filterStore = useFilterStore();

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
      onClick: (ids) => {
        agreeMenu(`Точно удалить сотрудника ${ids.id}?`, () =>
          staffStore.deleteMember(ids.id),
        );
      },
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
        staffStore.changeMember(ids.id, "name", value, "text", true),
    },
  ];

  let data = [];
  for (const memberId in staffStore.members) {
    const member = staffStore.members[memberId];
    const dataEl = {
      id: memberId,
      name: member.name,
      delete: true,
      copy: true,
      created: member.created,
      updated: member.updated,
    };

    data.push(dataEl);
  }
  data.push({
    id: "add",
  });

  useEffect(() => {
    staffStore.initMembers();
    filterStore.setFields(header, ["created", "updated"]);
  }, []);

  return (
    <main>
      <div className={styles.table}>
        <HorizontalTable data={data} header={header} isLoading={staffStore.isLoading} />
      </div>
    </main>
  );
}
