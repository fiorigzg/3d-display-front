let projectId = 100;
let prepackId = 200;
let shelfId = 2;
let rowId = 400;
let prepackTypeId = 300;

export function createProject(project) {
    project.id = projectId;
    console.log(`Project ${projectId} created`);
    projectId++;
    return project;
}

export function deleteProject(id) {
    console.log(`Project ${id} deleted`);
}

export function changeProject(id, project) {
    console.log(`Project ${id} changed`);
}

export function createPrepack(prepack) {
    prepack.id = prepackId;
    console.log(
        `Prepack ${prepackId} created for project ${prepack.projectId}`,
    );
    prepackId++;
    return prepack;
}

export function deletePrepack(id) {
    console.log(`Prepack ${id} deleted`);
}

export function changePrepack(id, prepack) {
    console.log(`Prepack ${id} changed`);
}

export function createShelf(shelf) {
    shelf.id = shelfId;
    console.log(`Shelf ${shelfId} created`);
    shelfId++;
    return shelf;
}

export function deleteShelf(id) {
    console.log(`Shelf ${id} deleted`);
}

export function changeShelf(id, shelf) {
    console.log(`Shelf ${id} changed`);
}

export function createRow(row) {
    row.id = rowId;
    console.log(`Row ${rowId} created`);
    rowId++;
    return row;
}

export function deleteRow(id) {
    console.log(`Row ${id} deleted`);
}

export function changeRow(id, row) {
    console.log(`Row ${id} changed`);
}

export function createPrepackType(prepackType) {
    prepackType.id = prepackTypeId;
    console.log(`Prepack Type ${prepackTypeId} created`);
    prepackTypeId++;
    return prepackType;
}

export function deletePrepackType(id) {
    console.log(`Prepack Type ${id} deleted`);
}

export function changePrepackType(id, prepackType) {
    console.log(`Prepack Type ${id} changed`);
}
