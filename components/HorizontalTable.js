import { useMemo, useCallback, useState, useEffect } from "react";
import { useDropzone } from "react-dropzone";
import { useTable } from "react-table";
import cx from "classnames";
import axios from "axios";

import styles from "./css/horizontalTable.module.scss";
import { serverUrl } from "constants/main";

const TableDate = ({ value }) => {
    const date = new Date(value);

    const day = String(date.getDate()).padStart(2, "0");
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const year = date.getFullYear();

    const hours = String(date.getHours()).padStart(2, "0");
    const minutes = String(date.getMinutes()).padStart(2, "0");

    return <p>{`${day}.${month}.${year} ${hours}:${minutes}`}</p>;
};

const TableUpload = ({ value, ids, onUpload, accept }) => {
    const onDrop = useCallback(
        async (acceptedFiles) => {
            const file = acceptedFiles[0];

            if (file) {
                const formData = new FormData();
                formData.append("file", file);

                try {
                    const response = await axios.post(
                        `${serverUrl}/uploadfile?save_name=${file.name}`,
                        formData,
                        {
                            headers: {
                                "Content-Type": "multipart/form-data",
                            },
                        },
                    );

                    if (response.data.status === "ok") {
                        onUpload(ids, response.data);
                    }
                } catch (error) {
                    console.error("Error uploading file:", error);
                }
            }
        },
        [ids, onUpload],
    );

    const { getRootProps, getInputProps } = useDropzone({
        onDrop,
        maxFiles: 1,
        accept: {
            "*": [accept],
        },
    });

    return (
        <div {...getRootProps()}>
            <input {...getInputProps()} />
            <button type="button">{value ? value : `Файл ${accept}`}</button>
        </div>
    );
};

const TableInput = ({ value, onEnter, column, thisIds }) => {
    const [inputValue, setInputValue] = useState(value);

    useEffect(() => {
        setInputValue(value);
    }, [value]);

    return (
        <input
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            onKeyDown={(e) => {
                if (e.key == "Enter") onEnter(e);
            }}
            onBlur={onEnter}
        />
    );
};

export default function HorizontalTable({
    data,
    header,
    excludedColumns,
    style = {},
    className = null,
}) {
    const realColumns = useMemo(() => {
        let columns = [];
        for (const element of header) {
            if (!excludedColumns.includes(element.param)) {
                columns.push({
                    Header: element.name,
                    accessor: element.param,
                    ...element,
                });
            }
        }
        return columns;
    }, [header, excludedColumns]);

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
                    if (value != "add") {
                        thisIds[column.accessor] = Number(value);
                        cellsArr.push(
                            <td key={cellsArr.length}>
                                {button}
                                <p>{value}</p>
                            </td>,
                        );
                    } else {
                        cellsArr.push(
                            <td key={cellsArr.length}>
                                <button onClick={() => column.onAdd(thisIds)}>
                                    <img src="/add.svg" />
                                </button>
                            </td>,
                        );
                    }
                } else if (column.type == "const") {
                    cellsArr.push(
                        <td key={cellsArr.length}>
                            {button}
                            <p>{value}</p>
                        </td>,
                    );
                } else if (column.type == "date") {
                    cellsArr.push(
                        <td key={cellsArr.length}>
                            <TableDate value={value} />
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
                            <TableInput
                                value={value}
                                onEnter={thisOnEnter}
                                column={column}
                                thisIds={thisIds}
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
                                    <img src={`/${column.icon}.svg`} />
                                </button>
                            </td>,
                        );
                    else cellsArr.push(<td key={cellsArr.length}></td>);
                } else if (column.type == "upload") {
                    cellsArr.push(
                        <td key={cellsArr.length}>
                            <TableUpload
                                value={value}
                                ids={thisIds}
                                accept={column.accept}
                                onUpload={column.onUpload}
                            />
                        </td>,
                    );
                }
            } else {
                cellsArr.push(
                    <td key={cellsArr.length} className={styles.bordless}></td>,
                );
            }
        }

        ids = { ...thisIds };
        rowsArr.push(<tr key={rowsArr.length}>{cellsArr}</tr>);
    }

    return (
        <table
            {...getTableProps()}
            key={getTableProps().key}
            style={{ ...style }}
            className={cx(styles.horizontalTable, className)}
        >
            <thead>
                {headerGroups.map((headerGroup) => (
                    <tr
                        {...headerGroup.getHeaderGroupProps()}
                        key={headerGroup.getHeaderGroupProps().key}
                    >
                        {headerGroup.headers.map((column) => {
                            if (
                                typeof column.width != "number" &&
                                typeof column.minWidth == "number"
                            )
                                column.minWidth = column.width;
                            if (
                                typeof column.width != "number" &&
                                typeof column.maxWidth == "number"
                            )
                                column.maxWidth = column.width;
                            return (
                                <th
                                    {...column.getHeaderProps()}
                                    key={column.getHeaderProps().key}
                                    style={{
                                        minWidth: column.minWidth,
                                        maxWidth: column.maxWidth,
                                        width: column.width,
                                    }}
                                >
                                    {column.type == "button"
                                        ? ""
                                        : column.render("Header")}
                                </th>
                            );
                        })}
                    </tr>
                ))}
            </thead>
            <tbody {...getTableBodyProps()} key={getTableBodyProps().key}>
                {rowsArr}
            </tbody>
        </table>
    );
}
