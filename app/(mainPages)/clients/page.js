import styles from "./page.module.scss";

import VInput from "components/VInput";

export default function Home() {
	return (
		<main>
			<div className={styles.menu}>
				<VInput text="Поиск по названию клиента" placeholder="Поиск клиента"/>
			</div>
			<div className={styles.workingSpace}>
				Here clients redactor should be
			</div>
		</main>
	);
}
