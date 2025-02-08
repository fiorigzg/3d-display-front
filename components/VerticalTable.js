"use client";

import cx from "classnames";

import styles from "./css/verticalTable.module.scss";

export default function VerticalTable({
    data,
    header,
    onEnter,
    style = {},
    className = null,
}) {
    let rowsArr = [];
    for (const element of header) {
        const thisOnEnter =
            element.param != null
                ? (e) => onEnter(element.param, e.target.value)
                : (e) => element.onEnter(e.target.value);

        rowsArr.push(
            <tr key={rowsArr.length}>
                <td>{element.name}</td>
                <td>
                    <input
                        defaultValue={
                            element.param != null
                                ? data[element.param]
                                : element.value
                        }
                        onKeyDown={(e) => {
                            if (e.key == "Enter") thisOnEnter(e);
                        }}
                        onBlur={thisOnEnter}
                    />
                </td>
            </tr>,
        );
    }

    return (
        <table
            style={{ ...style }}
            className={cx(styles.verticalTable, className)}
        >
            <tbody>{rowsArr}</tbody>
        </table>
    );
}
