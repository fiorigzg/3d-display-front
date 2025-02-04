import axios from "axios";

import { serverUrl } from "constants/main";

export async function getAll(endpoint, resFieldName, fields) {
    const res = await axios.get(`${serverUrl}${endpoint}`);
    const allServerData = res.data[resFieldName];
    let allData = {};

    for (const oneServerData of allServerData) {
        if (!("active" in oneServerData) || oneServerData.active) {
            let oneData = {};
            for (const field in fields) {
                oneData[field] = oneServerData[fields[field]];
            }
            allData[oneServerData.id] = oneData;
        }
    }

    return allData;
}

export async function createOne(endpoint, idFieldName, json, fields) {
    let realJson = {};
    for (const field in json) {
        if (field != "id") realJson[fields[field]] = json[field];
    }
    const res = await axios.post(`${serverUrl}${endpoint}`, realJson);
    return res.data[idFieldName];
}

export async function copyOne(endpoint) {
    console.log(`${endpoint} copied`);
    const id = Math.round(Math.random() * 100 + 100);
    return id;
}

export async function copyMultiple(endpoint, idsFieldName) {
    console.log(`${endpoint} copied`);
}

export async function deleteOne(endpoint) {
    const res = await axios.delete(`${serverUrl}${endpoint}`);
}

export function checkValueType(newValue, type) {
    const reg = /^-?\d*(\.\d*)?$/;
    let value = null;

    if (type == "number" && reg.test(newValue)) value = Number(newValue);
    if (type == "text" || type == "select" || type == "file") value = newValue;

    return value;
}

export async function changeOne(endpoint, changes, fields) {
    let realChanges = {};

    for (const field in changes) {
        if (field != "id") realChanges[fields[field]] = changes[field];
    }

    const res = await axios.put(`${serverUrl}${endpoint}`, realChanges);
}
