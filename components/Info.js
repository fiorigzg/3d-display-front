"use client";

import { useState } from "react";
import cx from "classnames";

import styles from "./css/info.module.scss";

export default function Info({
  value = 0,
  style = {},
  className = null,
  onEnter = () => console.log("saved"),
  isActive = true,
}) {
  let [realValue, setRealValue] = useState("");

  const realOnEnter = () => {
    if (realValue != "") {
      setRealValue("");
      onEnter(realValue);
    }
  };

  return (
    <input
      className={cx(styles.info, className)}
      style={{
        ...style,
        pointerEvents: isActive ? "auto" : "none",
      }}
      placeholder={value}
      value={realValue}
      type="number"
      onChange={(e) => setRealValue(Number(e.target.value))}
      onKeyDown={(e) => {
        if (e.key == "Enter") realOnEnter();
      }}
      onBlur={(e) => realOnEnter()}
    />
  );
}
