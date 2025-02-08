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
    for (const element of realData) {
        let cellsArr = [];
        console.log(element);
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
                if (column.type == "const")
                    cellsArr.push(
                        <td key={cellsArr.length}>
                            {button}
                            {value}
                        </td>,
                    );
                else if (column.type == "input")
                    cellsArr.push(
                        <td key={cellsArr.length}>
                            <input defaultValue={value} />
                        </td>,
                    );
                else if (column.type == "select")
                    cellsArr.push(
                        <td key={cellsArr.length}>
                            <select>
                                {column.options.map((option) => (
                                    <option
                                        key={option}
                                        selected={option == value}
                                    >
                                        {option}
                                    </option>
                                ))}
                            </select>
                        </td>,
                    );
            } else {
                cellsArr.push(<td key={cellsArr.length}></td>);
            }
        }

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
