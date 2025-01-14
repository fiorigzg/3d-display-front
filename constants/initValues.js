export const initProduct = {
    id: 1,
    clientId: 1,
    name: "Product",
    width: 10,
    height: 110,
    depth: 1110,
    weight: 1,
    count: 1000,
    volume: 990,
    qrcode: 10000,
    categoryId: 1,
    packageTypeId: 1,
    object: null,
    frontProjection: null,
};

export const initCategory = {
    id: 1,
    name: "Category",
};

export const initPackageType = {
    id: 1,
    name: "Package type",
};

export const initClient = {
    id: 1,
    name: "Client",
};

export const initPrepackType = {
    id: 1,
    name: "1/8 напольный на держателях",
};

export const initMember = {
    id: 1,
    name: "Staff member",
};

export const initProject = {
    id: 1,
    clientId: 1,
    name: "Project",
};

export const initPrepack = {
    id: 1,
    projectId: 1,
    name: "Prepack",
    width: 10,
    height: 20,
    depth: 30,
};

export const initShelf = {
    id: 1,
    prepackId: 1,
    rows: [],
};

export const initRow = {
    id: 1,
    left: 10,
    productId: 1,
};
