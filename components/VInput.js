import styles from "./css/vinput.module.scss"

export default function VInput({text, placeholder}) {
	return (
		<div className={styles.vinput}>
            <p>{text}</p>
            <input placeholder={placeholder}/>
		</div>
	);
}