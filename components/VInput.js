import styles from "./css/vinput.module.scss"

export default function VInput({text, placeholder, style}) {
	return (
		<div className={styles.vinput} style={style}>
            <p>{text}</p>
            <input placeholder={placeholder}/>
		</div>
	);
}