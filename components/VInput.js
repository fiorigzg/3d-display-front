"use client";

import cx from "classnames";

import styles from "./css/vInput.module.scss";

export default function VInput({
	text="VInput", placeholder="", value="",
	style={}, className=null,
	onChange=() => console.log("changed")
}) {
	return (
		<div className={cx(styles.vInput, className)} style={style}>
            <p>
				{text}
			</p>
            <input
				value={value}
				placeholder={placeholder}
				onChange={e => onChange(e.target.value)}
			/>
		</div>
	);
}