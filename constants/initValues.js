export const initProduct = {
    id: 1,
    name: "Новый товар",
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
    name: "Новая категория",
};

export const initPackageType = {
    id: 1,
    name: "Новый тип упаковки",
    object: "",
    frontSvg: "",
    sideSvg: "",
    topSvg: "",
};

export const initClient = {
    id: 1,
    name: "Новый клиент",
};

export const initPrepackType = {
    id: 1,
    name: "Новый тип препака",
};

export const initMember = {
    id: 1,
    name: "Новый сотрудник",
};

export const initProject = {
    id: 1,
    clientId: 1,
    name: "Новый предпроект",
};

export const initPrepack = {
    id: 1,
    projectId: 1,
    name: "Новый препак",
    width: 10,
    height: 20,
    depth: 30,
    image: "",
    number: 1,
    prepackTypeId: 12,
};

export const initShelf = {
    id: 1,
    prepackId: 1,
    width: 10,
    height: 0,
    length: 30,
    margin: 0,
    padding: 0,
    rows: {},
    json: {},
    isRows: true,
};

export const initRow = {
    id: 1,
    left: 10,
    productId: 24,
};
