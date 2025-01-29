import axios from "axios";

import { serverUrl } from "constants/main";

export async function getAll(partWidths) {
    let productImageNames = {};
    async function getProductImageName(productId) {
        console.log(productId);
        if (!(productId in productImageNames)) {
            let product = (await axios.get(`${serverUrl}/product_${productId}`))
                .data.product;
            productImageNames[productId] = product.facing_preview;
        }
        return productImageNames[productId];
    }

    const urlParams = new URLSearchParams(window.location.search);
    const standId = urlParams.get("poulticeId");
    const stand = (await axios.get(`${serverUrl}/poultice_${standId}`)).data
        .poultice;
    const shelves = (
        await axios.get(`${serverUrl}/shelves?poultice_id=${standId}`)
    ).data.shelves;

    let standWidth = stand.size_x;
    let standHeight = stand.size_y;

    let shelfSpacings = [];
    let products = [];
    let liners = [];
    let dividers = [];
    for (const shelf of shelves) {
        shelfSpacings.push(standHeight / shelves.length - partWidths.shelf);

        let shelfProducts = [];
        if ("elems" in shelf.json_shelf) {
            const serverShelfProducts = shelf.json_shelf.elems;
            console.log(shelf.json_shelf);

            for (const serverProduct of serverShelfProducts) {
                shelfProducts.push({
                    name: "nivea",
                    left: serverProduct.x,
                    bottom: serverProduct.z,
                    width: serverProduct.width,
                    height: serverProduct.height,
                    image: await getProductImageName(serverProduct.productId),
                });
            }
        }
        products.push(shelfProducts);

        let shelfLiners = [];
        if ("inserts" in shelf.json_shelf) {
            const serverShelfLiners = shelf.json_shelf.inserts;

            for (const serverLiner of serverShelfLiners) {
                shelfLiners.push({
                    left: serverLiner.x,
                    bottom: serverLiner.y,
                    width: serverLiner.width,
                    height: serverLiner.height,
                });
            }
        }
        liners.push(shelfLiners);

        let shelfDividers = [];
        if ("partitions" in shelf.json_shelf) {
            const serverShelfDividers = shelf.json_shelf.partitions;

            for (const serverDivider of serverShelfDividers) {
                shelfDividers.push({});
            }
        }
        dividers.push(shelfDividers);
    }

    return {
        standWidth: standWidth,
        standHeight: standHeight,
        standId: standId,
        shelfSpacings: shelfSpacings,
        products: products,
        liners: liners,
    };
}

export async function saveAll(standImageDataUrl, standImageName) {
    try {
        const standImageRes = await axios({
            method: "get",
            url: standImageDataUrl,
            responseType: "blob",
        });
        const standImageBlob = standImageRes.data;
        const standImageFile = new File([standImageBlob], standImageName, {
            type: standImageBlob.type,
        });
        const standImageFormData = new FormData();
        standImageFormData.append("file", standImageFile);

        // Send the form data to the server
        await axios.post(`${serverUrl}/uploadfile/`, standImageFormData, {
            headers: {
                "Content-Type": "multipart/form-data",
            },
            params: {
                save_name: true,
            },
        });
    } catch (error) {
        console.error("Error saving all data:", error);
    }
}
