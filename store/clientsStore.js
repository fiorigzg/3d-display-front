"use client";

import { initClient } from "constants/initValues";
import { getClients, createClient, deleteClient, changeClient } from "api/clientsApi";

import { create } from "zustand";

export const useClientsStore = create((set) => ({
    clients: [],

    initClients: async () => {
        const clients = await getClients();
        set({ clients: clients });
    },

    createClient: async () => {
        let client = { ...initClient };
        client = await createClient(client);

        set((state) => {
            let clients = state.clients;

            clients.push(client);

            return {
                clients: clients,
            };
        });
    },
    deleteClient: async (id) => {
        await deleteClient(id);

        set((state) => {
            let clients = state.clients;

            clients = clients.filter((client) => client.id != id);

            return {
                clients: clients,
            };
        });
    },
    changeClient: async (id, param, value, type) => {
        const reg = /^-?\d*(\.\d*)?$/;
        let realValue = null;
        if (type == "number" && reg.test(value)) realValue = Number(value);
        if (type == "text" || type == "select" || type == "file")
            realValue = value;

        if (realValue != null)
            changeClient(id, { [param]: realValue });

        set((state) => {
            let clients = state.clients;
            let client = clients.find((client) => client.id == id);
            
            if (realValue != null)
                client[param] = realValue;

            return {
                clients: clients,
            };
        });
    },
}));
