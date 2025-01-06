"use client";

import cx from "classnames";
import styles from "./css/colorBtn.module.scss"

export default function ColorBtn({
    text="", disabledText="", color="#0f72e3", icon=null, disabled=false,
    style={}, className=null,
    onClick=() => console.log("clicked")
}) {
    return (
        <button
            className={cx(styles.colorBtn, disabled ? styles.disabledColorBtn : null, className)}
            style={{ backgroundColor: disabled ? "#f6f8fa" : color, ...style }}
            onClick={() => onClick()}
            disabled={disabled ? "disabled" : ""}
        >
            <p>{disabled ? disabledText : text}</p>
            {icon != null && !disabled ? <img src={icon}/> : <div/>}
        </button>
    );
}