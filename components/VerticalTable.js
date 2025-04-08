"use client";

import { useMemo } from "react";
import cx from "classnames";

import styles from "./css/verticalTable.module.scss";

export default function VerticalTable({
  data,
  header,
  onEnter,
  style = {},
  className = null,
}) {
  const realHeader = useMemo(() => header, [header]);
  const realData = useMemo(() => data, [data]);

  let rowsArr = [];
  for (const element of realHeader) {
    let thisOnEnter = () => {};
    if (!element.isConst) {
      if (element.param == null) {
        thisOnEnter = (e) => element.onEnter(Number(e.target.value));
      } else {
        thisOnEnter = (e) => onEnter(element.param, Number(e.target.value));
      }
    }

    rowsArr.push(
      <tr key={rowsArr.length}>
        <td>{element.name}</td>
        <td>
          {element.isConst ? (
            <p>{realData[element.param]}</p>
          ) : (
            <input
              defaultValue={
                element.param != null ? realData[element.param] : element.value
              }
              onKeyDown={(e) => {
                if (e.key == "Enter") thisOnEnter(e);
              }}
              onBlur={thisOnEnter}
            />
          )}
        </td>
      </tr>,
    );
  }

  return (
    <table style={{ ...style }} className={cx(styles.verticalTable, className)}>
      <tbody>{rowsArr}</tbody>
    </table>
  );
}
