"use client";

import { initClient } from "constants/initValues";
import { clientFields } from "constants/fields";
import {
    getAll,
    createOne,
    copyOne,
    deleteOne,
    checkValueType,
    changeOne,
} from "api/common";

import { create } from "zustand";

export const useClientsStore = create((set) => ({
    clients: {},

    initClients: async () => {
        const clients = await getAll("/clients", "clients", clientFields);

        set((state) => {
            return { clients: clients };
        });
    },
    createClient: async () => {
        let client = { ...initClient };
        let id = await createOne(
            "/create_client",
            "client_id",
            client,
            clientFields,
        );

        set((state) => {
            let clients = state.clients;
            clients[id] = client;
            return {
                clients: clients,
            };
        });
    },
    copyClient: async (id) => {
        const copiedId = await copyOne(`/client_${id}`, clientFields);

        set((state) => {
            let clients = state.clients;
            let client = { ...clients[id] };
            clients[copiedId] = client;
            return {
                clients: clients,
            };
        });
    },
    deleteClient: async (id) => {
        await deleteOne(`/client_${id}`);

        set((state) => {
            let clients = state.clients;
            delete clients[id];
            return {
                clients: clients,
            };
        });
    },
    changeClient: async (id, param, value, type, isReq) => {
        let realValue = checkValueType(value, type);
        if (realValue != null) {
            if (isReq)
                await changeOne(
                    `/client_${id}`,
                    { [param]: realValue },
                    clientFields,
                );

            set((state) => {
                let clients = state.clients;
                let client = clients[id];
                client[param] = realValue;
                return {
                    clients: clients,
                };
            });
        }
    },
}));
