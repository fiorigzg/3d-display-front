"use client"

import cx from "classnames";

import styles from "./css/hInput.module.scss";

export default function HInput({
	text="HInput", placeholder="Число", unit="мм", twoLines=false, type="number", value="", disabled=false,
	style={}, className=null,
	onChange=() => console.log("changed")
}) {
	return (
		<div className={cx(styles.hInput, className)} style={style}>
            <p className={twoLines ? styles.twoLines : styles.oneLine}>
				{text}
			</p>
            <input
				value={value}
				type={type}
				accept={type == "file" ? unit : ""}
				placeholder={placeholder}
				onChange={e => {
					if(type == "file")
						onChange(e.target.value, e.target.files)
					else
						onChange(e.target.value)
				}}
				disabled={disabled ? "disabled" : ""}
			/>
			<div>
				{unit}
			</div>
		</div>
	);
}