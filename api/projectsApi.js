import axios from "axios";

import { serverUrl } from "constants/main";

export async function makeShelf(prepack, shelf, products, openPage = true) {
    console.log(prepack, shelf, products);
    let elems = [];
    let left = 0;
    for (let rowId in shelf.rows) {
        let row = shelf.rows[rowId];
        let product = products[row.productId];
        if (product.depth < 1) product.depth = 1;
        const count = Math.floor(prepack.depth / product.depth);
        let depth = 0;
        left += row.left;
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
                productId: product.id,
                shelfIndex: 0,
            });
            depth += product.depth;
        }
        left += product.width;
    }
    console.log(elems);
    let res = await axios.put(`${serverUrl}/shelf_${shelf.id}`, {
        json_shelf: { elems: elems },
    });

    if (openPage)
        window.open(
            `http://94.103.83.218:8080/?width=${prepack.width}&&height=${shelf.height}&&length=${prepack.depth}&&shelf_id=${shelf.id}`,
            "mywin",
            `width=${window.screen.availWidth / 2},height=${window.screen.availHeight}`,
        );
}

export async function makePrepack(prepack, shelves, products, openPage = true) {
    for (let shelfId in shelves) {
        let shelf = shelves[shelfId];
        await makeShelf(prepack, { ...shelf, id: shelfId }, products, false);
    }

    if (openPage)
        window.open(
            `http://94.103.83.218:3001/shelfHeight?poulticeId=${prepack.id}`,
            "mywin",
            `width=${window.screen.availWidth / 2},height=${window.screen.availHeight}`,
        );
}
