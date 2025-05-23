"use client";

import { usePathname } from "next/navigation";
import cx from "classnames";

import styles from "./css/header.module.scss";

export default function Headers() {
  const pathname = usePathname();

  const isActive = (href) => {
    if (href === "/") {
      return pathname === "/";
    }
    return pathname.startsWith(href);
  };

  return (
    <div className={styles.header}>
      <div className={styles["header-left"]}>
        <img src="/logo.svg" />
        <h1>Prepack Designer</h1>
      </div>
      <div className={styles["header-right"]}>
        <a href="/" className={cx({ [styles.selected]: isActive("/") })}>Главная</a>
        <a href="/clients" className={cx({ [styles.selected]: isActive("/clients") })}>Клиенты</a>
        <a href="/projects" className={cx({ [styles.selected]: isActive("/projects") })}>Проекты</a>
        <a href="/products" className={cx({ [styles.selected]: isActive("/products") })}>Продукты</a>
        <a href="/prepackTypes" className={cx({ [styles.selected]: isActive("/prepackTypes") })}>Типы препаков</a>
        <a href="/packageTypes" className={cx({ [styles.selected]: isActive("/packageTypes") })}>Типы упаковок</a>
        <a href="/categories" className={cx({ [styles.selected]: isActive("/categories") })}>Категории продуктов</a>
        <a href="/staffMembers" className={cx({ [styles.selected]: isActive("/staffMembers") })}>Сотрудники</a>
      </div>
    </div>
  );
}
