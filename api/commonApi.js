import axios from "axios";

import { serverUrl } from "constants/main";
import { newIdFields } from "constants/fields";

export async function getAll(endpoint, resFieldName, fields) {
    const res = await axios.get(`${serverUrl}${endpoint}`);
    const allServerData = res.data[resFieldName];
    let allData = {};

    for (const oneServerData of allServerData) {
        let oneData = {};
        for (const field in fields) {
            oneData[field] = oneServerData[fields[field]];
        }
        allData[oneServerData.id] = oneData;
    }

    return allData;
}

export async function runSequence(sequence) {
    const res = await axios.post(`${serverUrl}/run_sequence`, sequence);
    console.log(res);
}

export async function createOne(name, id, json, fields) {}

export async function copyOne(model, id) {
    const typeChange = {
        poultice: "prepack",
        prepack: "poultice",
    };
    if (model in typeChange) model = typeChange[model];

    let res = await axios.post(`${serverUrl}/clone_${model}_${id}`);
    let newIds = [];

    for (let newInstance of res.data.new_instances) {
        let newId = {};

        for (const field in newIdFields) {
            if (newIdFields[field] in newInstance)
                newId[field] = newInstance[newIdFields[field]];
        }

        if (newId.type in typeChange) newId.type = typeChange[newId.type];
        if (newId.parentType in typeChange)
            newId.parentType = typeChange[newId.parentType];

        newIds.push(newId);
    }

    return newIds;
}

export async function deleteOne(name, id) {}

export function checkValueType(newValue, type) {
    const reg = /^-?\d*(\.\d*)?$/;
    let value = null;

    if (type == "number" && reg.test(newValue)) value = Number(newValue);
    if (type == "text" || type == "select" || type == "file") value = newValue;

    return value;
}

export async function changeOne(name, id, changes, fields) {}
