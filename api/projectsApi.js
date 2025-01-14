import axios from "axios";

import { serverUrl } from "constants/main";

const projectFields = {
    id: "id",
    clientId: "client_id",
    name: "name",
};

const prepackFields = {
    id: "id",
    projectId: "project_id",
    type: "type",
    width: "size_x",
    height: "size_y",
    depth: "size_z",
};

const shelfFields = {
    id: "id",
    prepackId: "poulticle_id",
    rows: "json_rows",
};

const rowFields = {
    id: "id",
    productId: "product_id",
    left: "left",
};

const prepackTypeFields = {
    id: "id",
    name: "name",
};

const fieldTypes = {
    id: Number,
    clientId: String,
    name: String,
    description: String,
    startDate: String,
    endDate: String,
    projectId: String,
    type: String,
    quantity: Number,
    weight: Number,
    shelfId: String,
    position: Number,
    capacity: Number,
};

async function fetchData(url, dataName, fields) {
    const res = await axios.get(url);
    let newData = res.data[dataName]
        .filter((item) => item.active)
        .map((item) => {
            const mappedItem = {};
            for (const key in fields) {
                mappedItem[key] = item[fields[key]];
            }
            return mappedItem;
        });
    return newData;
}

export async function getProjects() {
    return await fetchData(`${serverUrl}/projects`, "projects", projectFields);
}

export async function getPrepacks() {
    return await fetchData(
        `${serverUrl}/poultices`,
        "poultices",
        prepackFields,
    );
}

export async function getShelves() {
    let data = await fetchData(
        `${serverUrl}/all_shelves`,
        "shelves",
        shelfFields,
    );

    for (let shelf of data) {
        if ("rows" in shelf) shelf.rows = [{ id: 1, product_id: 10, left: 10 }];
        else shelf.rows = [];

        for (let row of shelf.rows) {
            for (const field in rowFields) {
                row[field] = row[rowFields[field]];
            }
        }
    }

    return data;
}

export async function getPrepackTypes() {
    return await fetchData(
        `${serverUrl}/preptypes`,
        "preptypes",
        prepackTypeFields,
    );
}

async function postData(url, idField, data, fields, costil = {}) {
    const mappedData = { ...costil };
    for (const key in fields) {
        mappedData[fields[key]] = data[key];
    }

    const res = await axios.post(url, mappedData);
    data.id = res.data[idField];
    return data;
}

export async function createProject(project) {
    return await postData(
        `${serverUrl}/create_project`,
        "project_id",
        project,
        projectFields,
    );
}

export async function createPrepack(prepack) {
    return await postData(
        `${serverUrl}/poultice`,
        "poultice_id",
        prepack,
        prepackFields,
        { type_id: 1 },
    );
}

export async function createShelf(shelf) {
    return await postData(
        `${serverUrl}/shelf`,
        "shelf_id",
        shelf,
        shelfFields,
        { width: 0, heigth: 0, length: 0, margin_top: 0, margin_bottom: 0 },
    );
}

export async function createPrepackType(prepackType) {
    return await postData(
        `${serverUrl}/preptype`,
        "preptype_id",
        prepackType,
        prepackTypeFields,
    );
}

async function deleteData(url) {
    await axios.delete(url);
}

export async function deleteProject(id) {
    await deleteData(`${serverUrl}/project_${id}`);
}

export async function deletePrepack(id) {
    await deleteData(`${serverUrl}/poultice_${id}`);
}

export async function deleteShelf(id) {
    await deleteData(`${serverUrl}/shelf_${id}`);
}

export async function deletePrepackType(id) {
    await deleteData(`${serverUrl}/preptype_${id}`);
}

async function putData(url, changes, fields) {
    const mappedChanges = {};
    for (const key in changes) {
        mappedChanges[fields[key]] = changes[key];
    }

    await axios.put(url, mappedChanges);
}

export async function changeProject(id, changes) {
    await putData(`${serverUrl}/project_${id}`, changes, projectFields);
}

export async function changePrepack(id, changes) {
    await putData(`${serverUrl}/poultice_${id}`, changes, prepackFields);
}

export async function changeShelf(id, changes) {
    await putData(`${serverUrl}/shelf_${id}`, changes, shelfFields);
}

export async function changePrepackType(id, changes) {
    await putData(`${serverUrl}/preptype_${id}`, changes, prepackTypeFields);
}

export async function makeShelf(shelf, prepack, products) {
    let elems = [];

    for (let row of shelf.rows) {
        let product = products.find((product) => product.id == row.productId);
        const count = Math.floor(prepack.depth / product.depth);
        let depth = 0;
        for (let i = 0; i < count; i++) {
            elems.push({
                x: row.left,
                y: 0,
                z: depth,
                type: "goods",
                depth: product.depth,
                width: product.width,
                height: product.height,
                topSvg: product.packagingType.top_svg,
                sideSvg: product.packagingType.side_svg,
                shelfIndex: 0,
            });
            depth += product.depth;
        }
    }

    let res = await axios.put(`${serverUrl}/shelf_${shelf.id}`, {
        json_shelf: { elems: elems },
    });

    console.log(elems, res);
    window.open(
        `http://94.103.83.218:8080/?width=${prepack.width}&&height=${prepack.height}&&depth=${prepack.depth}&&shelf_id=${shelf.id}`,
        "_blank",
    );
}
