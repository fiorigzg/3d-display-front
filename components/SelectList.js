"use client";

import cx from "classnames";

import styles from "./css/selectList.module.scss";

export default function SelectList({
    optionIcon=null, options=[], selectedOptionIds=[],
    style={}, className=null,
    onSelect=() => console.log("selected")
}) {
	return (
		<div className={cx(styles.selectList, className)} style={style}>
            {
                options.map(({value, id}) => {
                    return (
                        <div
                            className={cx(styles.option, selectedOptionIds.includes(id) ? styles.selectedOption : null)}
                            key={id}
                            onMouseDown={() => onSelect(id, value)}
                        >
                            <img src={optionIcon}/>
                            <p>{value}</p>
                        </div>
                    );
                })
            }
		</div>
	);
}