import { useMemo, useCallback, useState, useEffect } from "react";
import { useDropzone } from "react-dropzone";
import { useTable } from "react-table";
import cx from "classnames";
import axios from "axios";
import Cookies from "js-cookie";

import styles from "./css/horizontalTable.module.scss";
import { isIdInTable, serverUrl } from "constants/main";
import { useFilterStore } from "store/filterStore";

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
        if (e.key === "Enter") onEnter(e);
      }}
      onBlur={onEnter}
    />
  );
};

export default function HorizontalTable({
  data,
  header,
  name = "",
  loadingText = null,
  isLoading = false,
}) {
  const [extended, setExtended] = useState({});
  const filterStore = useFilterStore();

  useEffect(() => {
    if (name && Object.keys(extended).length > 0) {
      Cookies.set(name, JSON.stringify(extended), { expires: 1 });
    }
  }, [extended, name]);

  useEffect(() => {
    const savedExtended = Cookies.get(name);
    if (savedExtended) {
      setExtended(JSON.parse(savedExtended));
    }
  }, [name]);

  const realColumns = useMemo(() => {
    let columns = [];
    for (const element of header) {
      if (!filterStore.excludedFields.includes(element.param)) {
        columns.push({
          Header: element.name,
          accessor: element.param,
          ...element,
        });
      }
    }
    return columns;
  }, [header, filterStore.excludedFields]);

  const realData = useMemo(() => {
    let newData = [...data];
    const fieldSorter = filterStore.fieldSorter;

    if (fieldSorter.param != "off") {
      const sortData = (newData, direction) => {
        return newData.sort((a, b) => {
          if (fieldSorter.param in a && fieldSorter.param in b) {
            if (a[fieldSorter.param] < b[fieldSorter.param]) {
              return direction === "increase" ? -1 : 1;
            }
            if (a[fieldSorter.param] > b[fieldSorter.param]) {
              return direction === "increase" ? 1 : -1;
            }
          }
          return 0;
        });
      };

      const sortRecursive = (element) => {
        if (element.children) {
          element.children = sortData(element.children, fieldSorter.direction);
          element.children.forEach(sortRecursive);
        }
      };

      newData = sortData(newData, fieldSorter.direction);
      newData.forEach(sortRecursive);
    }

    if (
      filterStore.fieldFilter.param !== "off" &&
      filterStore.fieldFilter.value != ""
    ) {
      const fieldFilter = filterStore.fieldFilter;

      const filterData = (newData) => {
        return newData.filter((element) => {
          if (fieldFilter.param in element) {
            if (
              element[fieldFilter.param].toString().includes(fieldFilter.value)
            ) {
              return true;
            }
          } else if ("children" in element) {
            let children = filterData(element.children);
            if (children.length > 0) {
              element.children = children;
              return true;
            }
          }
          return false;
        });
      };

      newData = filterData(newData);
    }

    if (
      filterStore.dateFilter.param !== "off" &&
      (filterStore.dateFilter.to != "" || filterStore.dateFilter.from != "")
    ) {
      const dateFilter = filterStore.dateFilter;

      const filterData = (newData) => {
        return newData.filter((element) => {
          if (dateFilter.param in element) {
            const elementDate = new Date(element[dateFilter.param]);
            const fromDate = new Date(dateFilter.from);
            const toDate = new Date(dateFilter.to);

            if (
              (isNaN(fromDate.getTime()) || elementDate >= fromDate) &&
              (isNaN(toDate.getTime()) || elementDate <= toDate)
            ) {
              return true;
            }
          } else if ("children" in element) {
            let children = filterData(element.children);
            if (children.length > 0) {
              element.children = children;
              return true;
            }
          }
          return false;
        });
      };

      newData = filterData(newData);
    }

    let resultData = [];

    function addChildren(element) {
      resultData.push(element);

      if ("children" in element) {
        element.isParent = true;
        if (extended[element.uniqueId]) element.children.forEach(addChildren);
      }
    }
    newData.forEach(addChildren);

    return resultData;
  }, [data, extended, filterStore.fieldSorter]);

  const { getTableProps, getTableBodyProps, headerGroups, rows, prepareRow } =
    useTable({ columns: realColumns, data: realData });

  let rowsArr = [];
  let ids = {};
  for (const element of realData) {
    let cellsArr = [];
    let thisIds = { ...ids };

    for (const column of realColumns) {
      const value = element[column.accessor];

      if (value != undefined) {
        if (column.type == "id") {
          if (value != "add") {
            thisIds[column.accessor] = value;

            const onExtend = () => {
              const uid = element.uniqueId;

              if (!(uid in extended))
                setExtended({
                  ...extended,
                  [uid]: true,
                });
              else
                setExtended({
                  ...extended,
                  [uid]: !extended[uid],
                });
            };

            let extendButton = null;
            if (!isIdInTable)
              extendButton = [
                element.isParent ? (
                  <button onClick={() => onExtend()}>
                    <img
                      src={
                        extended[element.uniqueId] ? "/close.svg" : "/open.svg"
                      }
                    />
                  </button>
                ) : null,
              ];
            if (isIdInTable)
              extendButton = [
                element.isParent ? (
                  <button
                    className={styles.switchExtendBtn}
                    onClick={() => onExtend()}
                  >
                    <img
                      src={
                        extended[element.uniqueId] ? "/close.svg" : "/open.svg"
                      }
                    />
                  </button>
                ) : null,
                <p>{value}</p>,
              ];

            cellsArr.push(<td key={cellsArr.length}>{extendButton}</td>);
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
                  column.onSelect(thisIds, Number(e.target.value))
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

  if (isLoading) {
    return (
      <div
        className={cx(styles.horizontalTable, styles.loadingContainer)}
      >
        <div className={styles.loadingIndicator}>
          { loadingText === null ? <div className={styles.spinner}></div> : <p>{loadingText}</p> }
        </div>
      </div>
    );
  }

  return (
    <table
      {...getTableProps()}
      key={getTableProps().key}
      className={cx(styles.horizontalTable)}
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
                  {column.type == "button" ? "" : column.render("Header")}
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
