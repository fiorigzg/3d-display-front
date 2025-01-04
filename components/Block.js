import styles from "./css/block.module.scss"

export default function Block({children}) {
    return (
        <div className={styles.block}>
            {children}
        </div>
    );
}