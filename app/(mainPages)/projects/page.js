"use client";

import cx from "classnames";
import styles from "./page.module.scss";

export default function Home() {
    return (
        <main>
            <div className={styles.workingSpace}>
                <div className={styles.title}>
                    <h1 className={styles.text}>Клиенты и препроекты</h1>
                </div>
            </div>
        </main>
    );
}
