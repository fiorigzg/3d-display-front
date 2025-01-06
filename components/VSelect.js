"use client";

import cx from "classnames";
import {useState} from "react";
import styles from "./css/vSelect.module.scss";

import SelectList from "./SelectList";

export default function VSelect({
	text="VSelect", placeholder="", optionIcon=null, options=[], selectedOptionId=-1,
	style={}, className=null,
	onSelect=() => console.log("selected")
}) {
	let selectedOptionValue = selectedOptionId != -1 ? options.find(option => option.id == selectedOptionId).value : "";

	const [focused, setFocused] = useState(false);
	const [filter, setFilter] = useState(selectedOptionValue);
	const [selectedOption, setSelectedOption] = useState({id: selectedOptionId, value: selectedOptionValue});

	return (
		<div className={cx(styles.vSelect, className)} style={style}>
            <p>
				{text}
			</p>
			<input
				value={filter}
				placeholder={placeholder}
				onFocus={() => setFocused(true)}
				onBlur={() => {
					setFocused(false)
					setFilter(selectedOption.value)
				}}
				onChange={e => setFilter(e.target.value)}
			/>
			<div className={styles.dropdownMenuOuter}>
				<div className={cx(styles.dropdownMenu, focused ? styles.menuOpened : styles.menuClosed)}>
					<SelectList
						optionIcon={optionIcon}
						options={options.filter(option => option.value.includes(filter))}
						selectedOptionIds={[selectedOption.id]}
						onSelect={(id, value) => {
							setSelectedOption({id: id, value: value});
							setFilter(value);
							onSelect(id);
						}}
					/>
				</div>
			</div>
		</div>
	);
}