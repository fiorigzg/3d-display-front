"use client";

import { useEffect } from "react";

import { serverUrl } from "constants/main";
import styles from "./page.module.scss";
import { useProductsStore } from "store/productsStore";
import { useFilterStore } from "store/filterStore";
import HorizontalTable from "components/HorizontalTable";
import agreeMenu from "components/agreeMenu";

export default function Home() {
  const productsStore = useProductsStore();
  const filterStore = useFilterStore();

  const header = [
    {
      name: "Тип упаковки",
      param: "id",
      type: "id",
      width: "100px",
      onAdd: (ids) => productsStore.createPackageType(),
    },
    {
      name: "Удаление",
      type: "button",
      icon: "delete",
      param: "delete",
      width: "50px",
      onClick: (ids) => {
        agreeMenu(`Точно удалить тип упаковки ${ids.id}?`, () =>
          productsStore.deletePackageType(ids.id),
        );
      },
    },
    {
      name: "Копирование",
      type: "button",
      icon: "copy",
      param: "copy",
      width: "50px",
      onClick: (ids) => productsStore.copyPackageType(ids.id),
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
      name: "Передняя проекция",
      type: "upload",
      param: "frontSvg",
      width: "calc(50% - 100px)",
      minWidth: "300px",
      accept: ".svg",
      onUpload: async (ids, data) => {
        await productsStore.changePackageType(
          ids.id,
          "frontSvg",
          data.original_file.replace("/loadfile/", ""),
          "text",
          true,
        );
        await productsStore.changePackageType(
          ids.id,
          "sideSvg",
          data.original_file.replace("/loadfile/", ""),
          "text",
          true,
        );
      },
    },
    {
      name: "Верхняя проекция",
      type: "upload",
      param: "topSvg",
      width: "calc(50% - 100px)",
      minWidth: "300px",
      accept: ".svg",
      onUpload: async (ids, data) => {
        await productsStore.changePackageType(
          ids.id,
          "topSvg",
          data.original_file.replace("/loadfile/", ""),
          "text",
          true,
        );
      },
    },
    {
      name: "Название",
      param: "name",
      type: "input",
      isNumber: false,
      width: "calc(50% - 100px)",
      minWidth: "300px",
      onEnter: (ids, value) =>
        productsStore.changePackageType(ids.id, "name", value, "text", true),
    },
  ];

  let data = [];
  for (const packageTypeId in productsStore.packageTypes) {
    const packageType = productsStore.packageTypes[packageTypeId];
    let dataEl = {
      id: packageTypeId,
      name: packageType.name,
      frontSvg: packageType.frontSvg,
      topSvg: packageType.topSvg,
      delete: true,
      copy: true,
      created: packageType.created,
      updated: packageType.updated,
    };

    data.push(dataEl);
  }
  data.push({
    id: "add",
  });

  useEffect(() => {
    productsStore.initPackageTypes();
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
