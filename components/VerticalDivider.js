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
    console.log(button)
    if ("onClick" in button) {
      buttonsArr.push(
        <button
          key={buttonsArr.length}
          onClick={button.onClick}
          className={marginBottom == 0 ? styles.firstBtn : null}
          style={{ bottom: `${marginBottom}px` }}
        >
          {button.text}
        </button>,
      );
    } else if ("link" in button) {
      buttonsArr.push(
        <a
          key={buttonsArr.length}
          href={button.link}
          className={marginBottom == 0 ? styles.firstBtn : null}
          style={{ bottom: `${marginBottom}px` }}
        >
          {button.text}
        </a>,
      );
    }

    marginBottom += 50;
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
