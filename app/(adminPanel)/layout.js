import "app/globals.scss";
import styles from "./layout.module.scss";

import Header from "components/Header";
import TopMenu from "components/TopMenu";
import SaveButton from "components/SaveButton";

export const metadata = {
    title: "PD Admin",
    description: "Admin panel",
};

export default function Layout({ children }) {
    return (
            <div>
                <Header />
                <TopMenu />
                <div className={styles.tableContainer}>{children}</div>
                <SaveButton />
            </div>
    );
}
