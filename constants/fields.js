export const clientFields = {
    name: "name",
};

export const memberFields = {
    name: "full_name",
};

export const packageTypeFields = {
    name: "name",
    frontSvg: "front_svg",
    sideSvg: "side_svg",
    topSvg: "top_svg",
    object: "object",
};

export const categoryFields = {
    name: "name",
};

export const productFields = {
    name: "name",
    width: "size_1",
    depth: "size_2",
    height: "size_3",
    weight: "weight",
    count: "units_per_package",
    volume: "volume",
    qrcode: "barcode",
    categoryId: "category_id",
    packageTypeId: "packaging_type_id",
    frontProjection: "facing_preview",
    clientId: "client_id",
    packagingX: "packaging_x",
    packagingY: "packaging_y",
    packagingZ: "packaging_z",
    packagingObj: "packaging_obj",
    packagingType: "packaging_type",
};

export const prepackTypeFields = {
    name: "name",
};

export const projectFields = {
    name: "name",
    clientId: "client_id",
};

export const prepackFields = {
    name: "name",
    width: "size_x",
    depth: "size_z",
    height: "size_y",
    prepackTypeId: "type_id",
    projectId: "project_id",
    image: "image",
    number: "number",
};

export const shelfFields = {
    rows: "json_rows",
    productId: "product_id",
    prepackId: "poulticle_id",
    width: "width",
    height: "heigth",
    length: "length",
    marginTop: "margin_top",
    marginBottom: "margin_bottom",
};

export const newIdFields = {
    type: "type",
    id: "id",
};
