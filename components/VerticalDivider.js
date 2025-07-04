"use client";

import { useState, useEffect } from "react";
import styles from "./css/verticalDivider.module.scss";

export default function VerticalDivider({ left, setLeft, buttons }) {
  const [isDividerDragging, setIsDividerDragging] = useState(false);

  useEffect(() => {
    const handleMouseMove = (e) => {
      if (isDividerDragging) {
        const newPos = (e.clientX / window.innerWidth) * 100;
        setLeft(Math.min(Math.max(newPos, 10), 90));
      }
    };

    const handleMouseUp = () => {
      setIsDividerDragging(false);
    };

    if (isDividerDragging) {
      window.addEventListener("mousemove", handleMouseMove);
      window.addEventListener("mouseup", handleMouseUp);
    } else {
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("mouseup", handleMouseUp);
    }

    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("mouseup", handleMouseUp);
    };
  }, [isDividerDragging]);

  const handleMouseDown = () => {
    setIsDividerDragging(true);
  };

  let buttonsArr = [];
  let marginBottom = 0;
  for (const button of buttons) {
    buttonsArr.push(
      <button
        id={button.id ? button.id : null}
        key={buttonsArr.length}
        onClick={button.onClick}
        onMouseDown={(e) => e.stopPropagation()}
        className={marginBottom == 0 ? styles.firstBtn : null}
        style={{ bottom: `${marginBottom}px` }}
      >
        {button.text}
      </button>
    );

    marginBottom += 37;
  }

  return (
    <div
      className={styles.verticalDivider}
      style={{ left: `${left}%` }}
      onMouseDown={(e) => {
        e.preventDefault();
        handleMouseDown(e);
      }}
    >
      {buttonsArr}
    </div>
  );
}
