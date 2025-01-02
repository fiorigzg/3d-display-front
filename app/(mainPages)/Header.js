import styles from "./css/header.module.scss"

export default function Headers({}) {
	return (
		<div className={styles.header}>
			<div className={styles['header-left']}>Prepack Designer</div>
			<div className={styles['header-right']}>
				<a href="/">Главная</a>
				<a href="/projects">Проекты</a>
				<a href="/clients">Клиенты</a>
			</div>
		</div>
	);
}