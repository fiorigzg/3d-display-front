import axios from "axios";

import { serverUrl } from "constants/main";
import { prepackFields, shelfFields } from "constants/fields";

export async function getAll(id) {
    let newPrepackValues = {};
    const prepackData = (await axios.get(`${serverUrl}/poultice_${id}`)).data
        .poultice;
    for (const field in prepackFields) {
        newPrepackValues[field] = prepackData[prepackFields[field]];
    }

    let newShelves = {};
    const shelvesData = (
        await axios.get(`${serverUrl}/shelves?poultice_id=${id}`)
    ).data.shelves;
    for (const shelf of shelvesData) {
        newShelves[shelf.id] = {};
        for (const field in shelfFields) {
            newShelves[shelf.id][field] = shelf[shelfFields[field]];
        }
        console.log(newShelves[shelf.id]);
    }

    return {
        ...newPrepackValues,
        shelves: newShelves,
    };
}

export async function getJsonShelf(id) {
    return (await axios.get(`${serverUrl}/shelf_${id}`)).data.shelf[0]
        .json_shelf;
}

export async function openShelfEditor(products, prepack, id) {
    let shelf = prepack.shelves[id];
    let shelfChanges = {};

    let elems = [];
    let left = 0;
    for (let rowId in shelf.rows) {
        const row = shelf.rows[rowId];
        const product = products[row.productId];

        left += row.left;
        let count = Math.floor(prepack.depth / product.depth);
        let depth = 0;
        for (let i = 0; i < count; i++) {
            elems.push({
                x: left,
                y: depth,
                z: 0,
                type: "goods",
                depth: product.depth,
                width: product.width,
                height: product.height,
                topSvg: product.packagingType.top_svg,
                sideSvg: product.packagingType.side_svg,
                productId: row.productId,
                shelfIndex: id,
            });
            depth += product.depth;
        }
        left += product.width;
    }
    shelfChanges.json = { elems: elems, inserts: [], partitions: [] };
    shelfChanges.isRows = false;

    let req = {};
    for (const field in shelfFields) {
        req[shelfFields[field]] = shelfChanges[field];
    }
    let res = await axios.put(`${serverUrl}/shelf_${id}`, req);

    window.open(
        `http://94.103.83.218:8080/?width=${prepack.width}&&height=${prepack.shelfThickness}&&length=${prepack.depth}&&shelf_id=${id}`,
        "mywin",
        `width=${window.screen.availWidth / 2},height=${window.screen.availHeight}`,
    );

    return shelfChanges;
}

export async function sendPrepackImage(prepackImageDataUrl, prepackId) {
    try {
        const prepackImageRes = await axios({
            method: "get",
            url: prepackImageDataUrl,
            responseType: "blob",
        });
        const prepackImageBlob = prepackImageRes.data;
        const prepackImageFile = new File(
            [prepackImageBlob],
            `paultice_${prepackId}.png`,
            {
                type: prepackImageBlob.type,
            },
        );
        const prepackImageFormData = new FormData();
        prepackImageFormData.append("file", prepackImageFile);

        // Send the form data to the server
        await axios.post(`${serverUrl}/uploadfile/`, prepackImageFormData, {
            headers: {
                "Content-Type": "multipart/form-data",
            },
            params: {
                save_name: true,
            },
        });

        window.location.replace(
            `http://94.103.83.218:8080/prepack?id=${prepackId}`,
        );
    } catch (error) {
        console.error("Error saving all data:", error);
    }
}
