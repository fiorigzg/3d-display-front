"use client";

import cx from "classnames";

import styles from "./css/header.module.scss";

export default function Headers({ style = {}, className = null }) {
    return (
        <div className={cx(styles.header, className)} style={style}>
            <div className={styles["header-left"]}>Prepack Designer</div>
            <div className={styles["header-right"]}>
                <a href="/">Главная</a>
                <a href="/clients">Клиенты</a>
                <a href="/projects">Проекты</a>
                <a href="/products">Продукты</a>
                <a href="/prepackTypes">Типы препаков</a>
                <a href="/packageTypes">Типы упаковок</a>
                <a href="/categories">Категории продуктов</a>
                <a href="/staffMembers">Сотрудники</a>
            </div>
        </div>
    );
}
