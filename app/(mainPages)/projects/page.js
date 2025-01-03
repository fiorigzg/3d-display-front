import cx from "classnames";
import Image from "next/image";
import styles from "./page.module.scss";

import VInput from "components/VInput";

export default function Home() {
	return (
		<main>
			<div className={styles.menu}>
				<div className={styles.projectFindMenu}>
					<VInput text="Поиск по названию проекта" placeholder="Поиск проекта"/>
				</div>
				<div className={styles.clientFindMenu}>
					<VInput text="Поиск по клиенту" placeholder="Поиск клиента"/>
					<div className={styles.clients}>
						<div className={styles.client}>
							<img src="/client.svg"/>
							<p>Клиент 1</p>
						</div>
						<div className={cx(styles.client, styles.selectedColor)}>
							<img src="/client.svg"/>
							<p>Клиент 2</p>
						</div>
						<div className={styles.client}>
							<img src="/client.svg"/>
							<p>Клиент 3</p>
						</div>
						<div className={styles.client}>
							<img src="/client.svg"/>
							<p>Клиент 4</p>
						</div>
					</div>
				</div>
			</div>
			<div className={styles.workingSpace}>
				Here projects redactor should be
			</div>
		</main>
	);
}
