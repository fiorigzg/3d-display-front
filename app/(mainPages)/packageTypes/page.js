"use client";

import { useEffect } from "react";
import { Table, Button, Select, Upload, message } from "antd";
import {
    PlusOutlined,
    DeleteOutlined,
    UploadOutlined,
} from "@ant-design/icons";

import { serverUrl } from "constants/main";
import styles from "./page.module.scss";
import { useProductsStore } from "store/productsStore";

const packageTypeNames = [
    "1: Овал/Blister",
    "2: Короб",
    "3: Спичечный",
    "4: Подвесной",
    "5: Накопочный короб",
];

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
            width: 200,
            render: (text, record) =>
                text == null ? null : (
                    <Select
                        size="small"
                        value={text}
                        placeholder="Название"
                        style={{
                            width: "200px",
                        }}
                        onChange={(value) =>
                            productsStore.changePackageType(
                                record.id,
                                "name",
                                value,
                                "text",
                                true,
                            )
                        }
                    >
                        {packageTypeNames.map((packageTypeName) => (
                            <Select.Option
                                key={packageTypeName}
                                value={packageTypeName}
                            >
                                {packageTypeName}
                            </Select.Option>
                        ))}
                    </Select>
                ),
        },
        {
            title: "Объект товара",
            dataIndex: "object",
            key: "object",
            width: 150,
            render: (text, record) => {
                console.log(text);
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
                        defaultFileList={text == "" ? [] : [text]}
                    >
                        <Button size="small" icon={<UploadOutlined />}>
                            Файл (.obj)
                        </Button>
                    </Upload>
                );
            },
        },
        {
            title: "Действие",
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
    ];

    let dataSource = [];
    for (const packageTypeId in productsStore.packageTypes) {
        let packageType = productsStore.packageTypes[packageTypeId];
        dataSource.push({
            ...packageType,
            id: packageTypeId,
            action: "delete",
            key: packageTypeId,
        });
    }
    dataSource.push({
        id: null,
        name: null,
        object: null,
        action: "add",
        key: "add",
    });

    return (
        <main>
            <div className={styles.workingSpace}>
                <Table
                    className={styles.table}
                    size="small"
                    columns={columns}
                    dataSource={dataSource}
                    pagination={false}
                    scroll={{ x: "max-content", y: "calc(100%)" }}
                />
            </div>
        </main>
    );
}
