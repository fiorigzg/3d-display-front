"use client";

import cx from "classnames";

import styles from "./css/header.module.scss"

export default function Headers({
	style={}, className=null
}) {
	return (
		<div className={cx(styles.header, className)} style={style}>
			<div className={styles['header-left']}>
				Prepack Designer
			</div>
			<div className={styles['header-right']}>
				<a href="/">Главная</a>
				<a href="/projects">Проекты</a>
				<a href="/clients">Клиенты</a>
			</div>
		</div>
	);
}