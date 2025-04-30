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
  created: new Date(Date.now()).toISOString().split("T")[0],
  updated: new Date(Date.now()).toISOString().split("T")[0],
};

export const initCategory = {
  id: 1,
  name: "Новая категория",
  created: new Date(Date.now()).toISOString().split("T")[0],
  updated: new Date(Date.now()).toISOString().split("T")[0],
};

export const initPackageType = {
  id: 1,
  name: "Новый тип упаковки",
  object: "",
  frontSvg: "",
  sideSvg: "",
  topSvg: "",
  created: new Date(Date.now()).toISOString().split("T")[0],
  updated: new Date(Date.now()).toISOString().split("T")[0],
};

export const initClient = {
  id: 1,
  name: "Новый клиент",
  created: new Date(Date.now()).toISOString().split("T")[0],
  updated: new Date(Date.now()).toISOString().split("T")[0],
};

export const initPrepackType = {
  id: 1,
  name: "Новый тип препака",
  created: new Date(Date.now()).toISOString().split("T")[0],
  updated: new Date(Date.now()).toISOString().split("T")[0],
};

export const initMember = {
  id: 1,
  name: "Новый сотрудник",
  created: new Date(Date.now()).toISOString().split("T")[0],
  updated: new Date(Date.now()).toISOString().split("T")[0],
};

export const initProject = {
  id: 1,
  clientId: 1,
  name: "Новый предпроект",
  created: new Date(Date.now()).toISOString().split("T")[0],
  updated: new Date(Date.now()).toISOString().split("T")[0],
  number: 1,
};

export const initPrepack = {
  id: 1,
  projectId: 1,
  name: "Новый препак",
  width: 380,
  height: 20,
  depth: 280,
  image: "",
  number: 1,
  prepackTypeId: 12,
  created: new Date(Date.now()).toISOString().split("T")[0],
  updated: new Date(Date.now()).toISOString().split("T")[0],
};

export const initShelf = {
  id: 1,
  prepackId: 1,
  width: 10,
  height: 0,
  length: 30,
  margin: 200,
  padding: 0,
  rows: {},
  json: {},
  isRows: true,
};

export const initRow = {
  id: 1,
  left: 10,
  count: 0,
  productId: 24,
  between: 0,
};
