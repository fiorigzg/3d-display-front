"use client";

import { initClient } from "constants/initValues";
import { clientFields } from "constants/fields";
import { getAll, checkValueType } from "api/commonApi";
import { useSaveStore } from "./saveStore";

import { create } from "zustand";

export const useClientsStore = create((set, get) => ({
    isLoading: true,
    clients: {},
    newClientId: 0,

    initClients: async () => {
        const clients = await getAll("/clients", "clients", clientFields);

        set((state) => {
            return { clients: clients, isLoading: false };
        });
    },
    createClient: async () => {
        let client = { ...initClient };
        const newClientId = get().newClientId + 1;
        await useSaveStore
            .getState()
            .createOne("client", "$" + newClientId, client, clientFields);

        set((state) => {
            let clients = state.clients;
            clients["$" + newClientId] = client;
            return {
                clients: clients,
                newClientId: newClientId,
            };
        });
    },
    copyClient: async (id) => {
        const newClientId = get().newClientId + 1;
        await useSaveStore
            .getState()
            .copyOne("client", id, { [`client-${id}`]: "$" + newClientId });

        set((state) => {
            let clients = state.clients;
            clients["$" + newClientId] = { ...clients[id] };
            return {
                clients: clients,
                newClientId: newClientId,
            };
        });
    },
    deleteClient: async (id) => {
        await useSaveStore.getState().deleteOne("client", id);

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
                await useSaveStore
                    .getState()
                    .changeOne(
                        "client",
                        id,
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
