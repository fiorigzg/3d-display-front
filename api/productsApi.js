import axios from "axios";

import { serverUrl } from "constants/main";

const productFields = {
    id: "id",
    clientId: "client_id",
    name: "name",
    width: "size_1",
    height: "size_2",
    depth: "size_3",
    weight: "weight",
    count: "units_per_package",
    volume: "volume",
    qrcode: "barcode",
    categoryId: "category_id",
    packageTypeId: "packaging_type_id",
    object: "packaging_object",
    frontProjection: "facing_preview",
    packagingType: "packaging_type",
};

const fieldTypes = {
    id: Number,
    clientId: String,
    name: String,
    width: Number,
    height: Number,
    depth: Number,
    weight: Number,
    count: Number,
    volume: Number,
    qrcode: String,
    categoryId: String,
    packageTypeId: String,
    object: String,
    frontProjection: String,
};

const costil = {
    packaging_x: 10,
    packaging_y: 10,
    packaging_z: 10,
    packaging_obj: "",
};

export async function getProducts() {
    const res = await axios.get(`${serverUrl}/products`);

    let products = [];
    const serverProducts = res.data.products;
    for (let serverProduct of serverProducts) {
        let product = {};

        for (const field in productFields) {
            product[field] = serverProduct[productFields[field]];
        }

        products.push(product);
    }

    return products;
}

export async function createProduct(product) {
    let serverProduct = { ...costil };

    for (const field in productFields) {
        if (fieldTypes[field] == Number)
            serverProduct[productFields[field]] = Number(product[field]);
        else if (fieldTypes[field] == String)
            serverProduct[productFields[field]] = String(product[field]);
    }

    const res = await axios.post(`${serverUrl}/product`, serverProduct);

    product.id = res.data.product_id;
    console.log(`Product ${product.id} created`);

    return product;
}

export async function deleteProduct(id) {
    await axios.delete(`${serverUrl}/product_${id}`);

    console.log(`Product ${id} deleted`);
}

export async function changeProduct(id, changes) {
    let realChanges = { ...costil };

    for (const field in productFields) {
        if (field in changes) {
            if (fieldTypes[field] == Number)
                realChanges[productFields[field]] = Number(changes[field]);
            else if (fieldTypes[field] == String)
                realChanges[productFields[field]] = String(changes[field]);
        }
    }

    console.log(`Product ${id} changed`);

    await axios.put(`${serverUrl}/product_${id}`, realChanges);
}

export async function getCategories() {
    const res = await axios.get(`${serverUrl}/categories`);

    let categories = [];
    const serverCategories = res.data.employees;

    for (let serverCategory of serverCategories) {
        categories.push({ id: serverCategory.id, name: serverCategory.name });
    }

    return categories;
}

export async function createCategory(category) {
    const res = await axios.post(`${serverUrl}/productcategory`, {
        name: category.name,
    });

    category.id = res.data.category_id;
    console.log(`Category ${category.id} created`);

    return category;
}

export async function deleteCategory(id) {
    await axios.delete(`${serverUrl}/productcategory_${id}`);

    console.log(`Category ${id} deleted`);
}

export async function changeCategory(id, changes) {
    let realChanges = {};

    if ("name" in changes) realChanges["name"] = changes["name"];

    console.log(realChanges);

    await axios.put(`${serverUrl}/category_${id}`, realChanges);
}

export async function getPackageTypes() {
    const res = await axios.get(`${serverUrl}/productcategory`);

    let packageTypes = [];
    const serverPackageTypes = res.data.employees;

    for (let serverPackageType of serverPackageTypes) {
        packageTypes.push({
            id: serverPackageType.id,
            name: serverPackageType.name,
        });
    }

    return packageTypes;
}

export async function createPackageType(packageType) {
    const res = await axios.post(`${serverUrl}/create_packageType`, {
        name: packageType.name,
    });

    packageType.id = res.data.packageType_id;
    console.log(`PackageType ${packageType.id} created`);

    return packageType;
}

export async function deletePackageType(id) {
    await axios.delete(`${serverUrl}/packageType_${id}`);

    console.log(`PackageType ${id} deleted`);
}

export async function changePackageType(id, changes) {
    let realChanges = {};

    if ("name" in changes) realChanges["name"] = changes["name"];

    console.log(realChanges);

    await axios.put(`${serverUrl}/packageType_${id}`, realChanges);
}
