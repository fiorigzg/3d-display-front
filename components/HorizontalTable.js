"use client";

import { useMemo } from "react";
import { useTable } from "react-table";
import cx from "classnames";
import styles from "./css/horizontalTable.module.scss";

export default function HorizontalTable({
    data,
    header,
    style = {},
    className = null,
}) {
    const realColumns = useMemo(() => {
        let columns = [];
        for (const element of header) {
            columns.push({
                Header: element.name,
                accessor: element.param,
                ...element,
            });
        }
        return columns;
    }, [header]);
    const realData = useMemo(() => data, [data]);

    const { getTableProps, getTableBodyProps, headerGroups, rows, prepareRow } =
        useTable({ columns: realColumns, data: realData });

    let rowsArr = [];
    let ids = {};
    for (const element of realData) {
        let cellsArr = [];
        let thisIds = { ...ids };

        for (const column of realColumns) {
            const value = element[column.accessor];
            let button = null;
            if (column.onSwitchExtend != undefined) {
                button = (
                    <button
                        className={styles.switchExtendBtn}
                        onClick={() => column.onSwitchExtend(value)}
                    >
                        +
                    </button>
                );
            }

            if (value != undefined) {
                if (column.type == "id") {
                    thisIds[column.accessor] = Number(value);
                    cellsArr.push(
                        <td key={cellsArr.length}>
                            {button}
                            <p>{value}</p>
                        </td>,
                    );
                } else if (column.type == "const") {
                    cellsArr.push(
                        <td key={cellsArr.length}>
                            {button}
                            <p>{value}</p>
                        </td>,
                    );
                } else if (column.type == "input") {
                    const thisOnEnter = (e) => {
                        let newValue = e.target.value;
                        if (column.isNumber) newValue = Number(newValue);
                        column.onEnter(thisIds, newValue);
                    };
                    cellsArr.push(
                        <td key={cellsArr.length}>
                            <input
                                defaultValue={value}
                                onKeyDown={(e) => {
                                    if (e.key == "Enter") thisOnEnter(e);
                                }}
                                onBlur={thisOnEnter}
                            />
                        </td>,
                    );
                } else if (column.type == "select") {
                    let optionsArr = [];
                    for (const optionId in column.options) {
                        const option = column.options[optionId];
                        optionsArr.push(
                            <option
                                key={option}
                                selected={optionId == value}
                                value={optionId}
                            >
                                {option}
                            </option>,
                        );
                    }

                    cellsArr.push(
                        <td key={cellsArr.length}>
                            <select
                                onChange={(e) =>
                                    column.onSelect(
                                        thisIds,
                                        Number(e.target.value),
                                    )
                                }
                            >
                                {optionsArr}
                            </select>
                        </td>,
                    );
                } else if (column.type == "button") {
                    if (value)
                        cellsArr.push(
                            <td key={cellsArr.length}>
                                <button onClick={() => column.onClick(thisIds)}>
                                    {column.name}
                                </button>
                            </td>,
                        );
                    else cellsArr.push(<td key={cellsArr.length}></td>);
                }
            } else {
                cellsArr.push(<td key={cellsArr.length}></td>);
            }
        }

        ids = { ...thisIds };
        rowsArr.push(<tr key={rowsArr.length}>{cellsArr}</tr>);
    }

    return (
        <table
            {...getTableProps()}
            style={{ ...style }}
            className={cx(styles.horizontalTable, className)}
        >
            <thead>
                {headerGroups.map((headerGroup) => (
                    <tr {...headerGroup.getHeaderGroupProps()}>
                        {headerGroup.headers.map((column) => (
                            <th
                                {...column.getHeaderProps()}
                                style={{ minWidth: column.width }}
                            >
                                {column.render("Header")}
                            </th>
                        ))}
                    </tr>
                ))}
            </thead>
            <tbody {...getTableBodyProps()}>{rowsArr}</tbody>
        </table>
    );
}
