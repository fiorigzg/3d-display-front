import axios from "axios";

import { serverUrl } from "constants/main";

export async function getClients() {
    const res = await axios.get(`${serverUrl}/clients`);

    let clients = [];
    const serverClients = res.data.clients;

    for (let serverClient of serverClients) {
        if (serverClient.active)
            clients.push({ id: serverClient.id, name: serverClient.name });
    }

    return clients;
}

export async function createClient(client) {
    const res = await axios.post(`${serverUrl}/create_client`, {
        name: client.name,
    });

    client.id = res.data.client_id;
    console.log(`Client ${client.id} created`);

    return client;
}

export async function deleteClient(id) {
    await axios.delete(`${serverUrl}/client_${id}`);

    console.log(`Client ${id} deleted`);
}

export async function changeClient(id, changes) {
    let realChanges = {};

    if ("name" in changes) realChanges["name"] = changes["name"];

    await axios.put(`${serverUrl}/client_${id}`, realChanges);
}
