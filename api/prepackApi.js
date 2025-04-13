import axios from "axios";

import { serverUrl, shelfUrl } from "constants/main";
import { prepackFields, shelfFields } from "constants/fields";

export async function getAll(id, session = null) {
  let newPrepackValues = {};
  let prepackData = (
    await axios.get(
      `${serverUrl}/poultice_${id}${session == null ? "" : "?session_name=" + session}`,
    )
  ).data.poultice.at(-1);

  for (const field in prepackFields) {
    if (field == "boxSizes") {
      let tempBoxSizes = prepackData[prepackFields[field]] || {};
      if (!("width" in tempBoxSizes)) tempBoxSizes.width = 0;
      if (!("height" in tempBoxSizes)) tempBoxSizes.height = 0;
      if (!("depth" in tempBoxSizes)) tempBoxSizes.depth = 0;
      newPrepackValues[field] = tempBoxSizes;
    } else newPrepackValues[field] = prepackData[prepackFields[field]];
  }

  // newPrepackValues.info = {};
  // const projectData = (
  //   await axios.get(
  //     `${serverUrl}/project_${prepackData.project_id}`
  //   )
  // ).data.project;
  // const clientData = (
  //   await axios.get(
  //     `${serverUrl}/client_${projectData.client_id}`
  //   )
  // ).data.client;

  let newShelves = {};
  const shelvesData = (
    await axios.get(`${serverUrl}/shelves?poultice_id=${id}`)
  ).data.shelves;
  for (const shelf of shelvesData) {
    newShelves[shelf.id] = {};
    for (const field in shelfFields) {
      newShelves[shelf.id][field] = shelf[shelfFields[field]];
    }
  }

  return {
    ...newPrepackValues,
    shelves: newShelves,
  };
}

export async function saveAll(session) {
  await axios.post(`${serverUrl}/commit_session?session_name=${session}`);
}

export async function getJsonShelf(id, session) {
  return (
    await axios.get(`${serverUrl}/shelf_${id}?session_name=${session}`)
  ).data.shelf.at(-1).json_shelf;
}

export async function openShelfEditor(
  products,
  prepack,
  id,
  clientId,
  session,
) {
  let shelf = prepack.shelves[id];
  let shelfChanges = {};

  if (shelf.isRows) {
    let elems = [];
    let left = 0;
    for (let rowId in shelf.rows) {
      const row = shelf.rows[rowId];
      const product = products[row.productId];

      left += row.left;
      let count = row.count || Math.floor(
        (prepack.depth -
          prepack.backThickness -
          prepack.frontThickness -
          shelf.padding * 2) /
          product.depth,
      );
      let depth = 0;
      for (let i = 0; i < count; i++) {
        elems.push({
          x: left,
          y: depth,
          z: 0,
          type: "goods",
          depth: product.depth,
          width: product.width,
          height: product.height,
          weight: product.weight,
          topSvg: product.packagingType.top_svg,
          sideSvg: product.packagingType.side_svg,
          productId: row.productId,
          shelfIndex: id,
        });
        depth += product.depth;
      }
      left += product.width;
    }
    shelfChanges.json = { elems: elems, inserts: [], partitions: [] };
    shelfChanges.isRows = false;

    let req = {};
    for (const field in shelfFields) {
      req[shelfFields[field]] = shelfChanges[field];
    }
    let res = await axios.put(
      `${serverUrl}/shelf_${id}?session_name=${session}&execNow=true`,
      req,
    );
  }

  window.open(
    `${shelfUrl}/?width=${prepack.width - prepack.sideThickness * 2 - shelf.padding * 2}&&height=${prepack.shelfThickness}&&length=${
      prepack.depth -
      prepack.backThickness -
      prepack.frontThickness -
      shelf.padding * 2
    }&&shelf_id=${id}&&client_id=${clientId}&&between_shelves=${shelf.margin}&&session_name=${session}`,
    "mywin",
    `width=${window.screen.availWidth / 2},height=${window.screen.availHeight}`,
  );

  return shelfChanges;
}

export async function sendPrepackImage(
  prepackImageDataUrl,
  prepackId,
  session,
) {
  try {
    const prepackImageRes = await axios({
      method: "get",
      url: prepackImageDataUrl,
      responseType: "blob",
    });
    const prepackImageBlob = prepackImageRes.data;
    const prepackImageFile = new File(
      [prepackImageBlob],
      `paultice_${prepackId}.png`,
      {
        type: prepackImageBlob.type,
      },
    );
    const prepackImageFormData = new FormData();
    prepackImageFormData.append("file", prepackImageFile);

    // Send the form data to the server
    await axios.post(`${serverUrl}/uploadfile`, prepackImageFormData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
      params: {
        save_name: true,
      },
    });

    window.open(`${shelfUrl}/prepack?id=${prepackId}&&session_name=${session}`);
  } catch (error) {
    console.error("Error saving all data:", error);
  }
}

export async function changeOne(endpoint, changes, fields, session) {
  let realChanges = {};

  for (const field in changes) {
    if (field != "id" && field != "info")
      realChanges[fields[field]] = changes[field];
  }

  const res = await axios.put(
    `${serverUrl}${endpoint}?session_name=${session}&execNow=true`,
    realChanges,
  );
}

export async function createOne(endpoint, json, fields, idParam, session) {
  let realJson = {};
  for (const field in json) {
    if (field != "id" && field != "info") realJson[fields[field]] = json[field];
  }
  const res = await axios.post(
    `${serverUrl}${endpoint}?session_name=${session}&execNow=true`,
    realJson,
  );

  return res.data[idParam];
}

export async function deleteOne(endpoint, session) {
  const res = await axios.delete(
    `${serverUrl}${endpoint}?session_name=${session}&execNow=true`,
  );
}
