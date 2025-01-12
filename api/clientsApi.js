let clientId = 300;

export function createClient(client) {
    client.id = clientId;
    console.log(`Product ${clientId} created`);
    clientId++;
    return client;
}

export function deleteClient(id) {
    console.log(`Product ${id} deleted`);
}

export function changeClient(id, client) {
    console.log(`Product ${id} changed`);
}

