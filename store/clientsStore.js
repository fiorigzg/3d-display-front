"use client";

import { initClient } from "constants/initValues";
import { createClient, deleteClient, changeClient } from "api/clientsApi";

import { create } from "zustand";

export const useClientsStore = create((set) => ({
    clients: [{ ...initClient }],
    createClient: () => {
        set((state) => {
            let clients = state.clients;
            let client = { ...initClient };

            client = createClient(client);
            clients.push(client);

            return {
                clients: clients,
            };
        });
    },
    deleteClient: (id) => {
        set((state) => {
            let clients = state.clients;

            clients = clients.filter((client) => client.id != id);
            deleteClient(id);

            return {
                clients: clients,
            };
        });
    },
    changeClient: (id, param, value, type) => {
        set((state) => {
            const reg = /^-?\d*(\.\d*)?$/;
            let clients = state.clients;
            let client = clients.find((client) => client.id == id);

            let realValue = client[param];

            if (type == "number" && reg.test(value)) realValue = Number(value);
            if (type == "text" || type == "select" || type == "file")
                realValue = value;

            client[param] = realValue;
            changeClient(id, client);

            return {
                clients: clients,
            };
        });
    },
}));
