"use client";

import { create } from "zustand";

export const useCliensStore = create((set) => ({
  clientNameFilter: "",
  lastClientId: 0,
  clients: [],
  setClients: (value) => set({ clients: value }),
  setClientNameFilter: (value) => set({ clientNameFilter: value }),
  setClientValue: (clientId, param, value) =>
    set((state) => {
      let newClients = state.clients;
      newClients.find((client) => client.id == clientId)[param] = value;
      return {
        clients: newClients,
      };
    }),
  addClient: () =>
    set((state) => {
      let newClients = state.clients;
      let newClientId = state.lastClientId + 1;
      newClients.unshift({
        id: newClientId,
        name: "Client 1",
        lastProductId: 1,
        products: [],
      });
      return {
        clients: newClients,
        lastClientId: newClientId,
      };
    }),
  deleteClient: (clientId) =>
    set((state) => {
      let newClients = state.clients;
      newClients = newClients.filter((client) => client.id != clientId);
      return {
        clients: newClients,
      };
    }),
  setProductValue: (clientId, productId, param, value) =>
    set((state) => {
      let newClients = state.clients;
      newClients
        .find((client) => client.id == clientId)
        .products.find((product) => product.id == productId)[param] = value;
      return {
        clients: newClients,
      };
    }),
  addProduct: (clientId) =>
    set((state) => {
      let newClients = state.clients;
      let newProductId =
        newClients.find((client) => client.id == clientId).lastProductId + 1;
      newClients
        .find((client) => client.id == clientId)
        .products.push({
          id: newProductId,
          object: { value: "", files: [] },
          frontalProjection: { value: "", files: [] },
          sideProjection: { value: "", files: [] },
          isMade: false,
        });
      newClients.find((client) => client.id == clientId).lastProductId =
        newProductId;

      return {
        clients: newClients,
      };
    }),
  deleteProduct: (clientId, productId) =>
    set((state) => {
      let newClients = state.clients;
      newClients.find((client) => client.id == clientId).products = newClients
        .find((client) => client.id == clientId)
        .products.filter((product) => product.id != productId);
      return {
        clients: newClients,
      };
    }),
}));
