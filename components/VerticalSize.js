"use client";

import cx from "classnames";

import styles from "./css/verticalSize.module.scss";

export default function VerticalSize({ value, height, top, left, color }) {
  return (
    <div
      className={styles.verticalSize}
      style={{
        top: top,
        left: left - 17,
        height: height,
      }}
    >
      <p
        style={{
          color: color,
        }}
      >
        {Math.round(value)}
      </p>
      <div
        style={{
          backgroundColor: color,
        }}
      />
    </div>
  );
}
