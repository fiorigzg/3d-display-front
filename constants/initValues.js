export const initProduct = {
    id: 1,
    name: "Product",
    width: 0,
    height: 0,
    depth: 0,
    weight: 0,
    count: 0,
    volume: 0,
    qrcode: "",
    categoryId: 14,
    packageTypeId: 7,
    clientId: 0,
    frontProjection: "",
};

export const initCategory = {
    id: 1,
    name: "Category",
};

export const initPackageType = {
    id: 1,
    name: "1: Овал/Blister",
    object: "",
    frontSvg: "",
    sideSvg: "",
    topSvg: "",
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
