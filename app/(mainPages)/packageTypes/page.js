"use client";

import { useEffect } from "react";

import { serverUrl } from "constants/main";
import styles from "./page.module.scss";
import { useProductsStore } from "store/productsStore";
import HorizontalTable from "components/HorizontalTable";

export default function Home() {
    const productsStore = useProductsStore();

    useEffect(() => {
        productsStore.initPackageTypes();
    }, []);

    const columns = [
        {
            title: "Название",
            dataIndex: "name",
            key: "name",
            fixed: "left",
            width: 170,
            render: (text, record) => {
                const onEnter = (e) =>
                    productsStore.changePackageType(
                        record.id,
                        "name",
                        e.target.value,
                        "text",
                        true,
                    );
                return text == null ? null : (
                    <Input
                        size="small"
                        value={text}
                        onChange={(e) =>
                            productsStore.changePackageType(
                                record.id,
                                "name",
                                e.target.value,
                                "text",
                                false,
                            )
                        }
                        onBlur={onEnter}
                        onPressEnter={onEnter}
                    />
                );
            },
        },
        {
            title: "Объект товара",
            dataIndex: "object",
            key: "object",
            width: 150,
            render: (text, record) => {
                return text == null ? null : (
                    <Upload
                        maxCount={1}
                        accept=".obj"
                        action={`${serverUrl}/uploadfile?save_name="${text}"`}
                        onChange={async ({ file }) => {
                            if (
                                file.status == "done" &&
                                file.response.status == "ok"
                            ) {
                                await productsStore.putPackageType(
                                    record.id,
                                    {
                                        frontSvg: file.response.front_svg_file,
                                        sideSvg: file.response.side_svg_file,
                                        topSvg: file.response.top_svg_file,
                                        object: file.response.original_file,
                                    },
                                    true,
                                );
                            }
                        }}
                        defaultFileList={text == "" ? [] : [{ name: text }]}
                    >
                        <Button size="small" icon={<UploadOutlined />}>
                            Файл (.obj)
                        </Button>
                    </Upload>
                );
            },
        },
        {
            title: "Добавление/удаление",
            dataIndex: "action",
            key: "action",
            width: 100,
            render: (text, record) =>
                text == "add" ? (
                    <Button
                        size="small"
                        type="primary"
                        icon={<PlusOutlined />}
                        onClick={() => productsStore.createPackageType()}
                    >
                        Добавить
                    </Button>
                ) : (
                    <Button
                        size="small"
                        type="primary"
                        danger
                        icon={<DeleteOutlined />}
                        onClick={() =>
                            productsStore.deletePackageType(record.id)
                        }
                    >
                        Удалить
                    </Button>
                ),
        },
        {
            title: "Копирование",
            dataIndex: "action",
            key: "copy",
            width: 100,
            render: (text, record) =>
                text == "other" ? (
                    <Button
                        size="small"
                        type="primary"
                        icon={<PlusOutlined />}
                        onClick={() => productsStore.copyPackageType(record.id)}
                    >
                        Копировать
                    </Button>
                ) : null,
        },
    ];

    const header = [
        {
            name: "Тип упаковки",
            param: "id",
            type: "id",
            width: "100px",
            onAdd: (ids) => productsStore.createPackageType(),
        },
        {
            name: "Удаление",
            type: "button",
            icon: "delete",
            param: "delete",
            width: "50px",
            onClick: (ids) => productsStore.deletePackageType(ids.id),
        },
        {
            name: "Копирование",
            type: "button",
            icon: "copy",
            param: "copy",
            width: "50px",
            onClick: (ids) => productsStore.copyPackageType(ids.id),
        },
        {
            name: "Объект товара",
            type: "upload",
            param: "object",
            width: "calc(50% - 100px)",
            minWidth: "300px",
            accept: ".obj",
            onUpload: async (ids, data) => {
                await productsStore.putPackageType(
                    ids.id,
                    {
                        frontSvg: data.front_svg_file,
                        sideSvg: data.side_svg_file,
                        topSvg: data.top_svg_file,
                        object: data.original_file,
                    },
                    true,
                );
            },
        },
        {
            name: "Название",
            param: "name",
            type: "input",
            isNumber: false,
            width: "calc(50% - 100px)",
            minWidth: "300px",
            onEnter: (ids, value) =>
                productsStore.changePackageType(
                    ids.id,
                    "name",
                    value,
                    "text",
                    true,
                ),
        },
    ];

    let data = [];
    for (const packageTypeId in productsStore.packageTypes) {
        const packageType = productsStore.packageTypes[packageTypeId];
        data.push({
            id: packageTypeId,
            name: packageType.name,
            object: packageType.object,
            delete: true,
            copy: true,
        });
    }
    data.push({
        id: "add",
    });

    return (
        <main>
            <div className={styles.workingSpace}>
                <HorizontalTable data={data} header={header} />
            </div>
        </main>
    );
}
