"use client";

import {
    initProduct,
    initCategory,
    initPackageType,
} from "constants/initValues";
import {
    getProducts,
    createProduct,
    deleteProduct,
    changeProduct,
    getCategories,
    createCategory,
    deleteCategory,
    changeCategory,
    getPackageTypes,
    createPackageType,
    deletePackageType,
    changePackageType,
} from "api/productsApi";

import { create } from "zustand";

export const useProductsStore = create((set) => ({
    products: [],
    categories: [],
    packageTypes: [],

    initProducts: async () => {
        const products = await getProducts();
        set({ products: products });
    },
    initCategories: async () => {
        const categories = await getCategories();
        set({ categories: categories });
    },
    initPackageTypes: async () => {
        const packageTypes = await getPackageTypes();
        set({ packageTypes: packageTypes });
    },

    createProduct: async (clientId) => {
        let product = { ...initProduct };

        product.clientId = clientId;
        product = await createProduct(product);

        set((state) => {
            let products = state.products;
            products.push(product);

            return {
                products: products,
            };
        });
    },
    deleteProduct: async (id) => {
        await deleteProduct(id);

        set((state) => {
            let products = state.products;

            products = products.filter((product) => product.id != id);

            return {
                products: products,
            };
        });
    },
    changeProduct: async (id, param, value, type) => {
        const reg = /^-?\d*(\.\d*)?$/;
        let realValue = null;
        if (type == "number" && reg.test(value)) realValue = Number(value);
        if (type == "text" || type == "select" || type == "file")
            realValue = value;

        if (realValue != null) changeProduct(id, { [param]: realValue });

        set((state) => {
            let products = state.products;
            let product = products.find((product) => product.id == id);

            if (realValue != null) product[param] = realValue;

            return {
                products: products,
            };
        });
    },

    createCategory: async () => {
        let category = { ...initCategory };
        category = await createCategory(category);

        set((state) => {
            let categories = state.categories;
            categories.push(category);

            return {
                categories: categories,
            };
        });
    },
    deleteCategory: async (id) => {
        await deleteCategory(id);

        set((state) => {
            let categories = state.categories;

            categories = categories.filter((category) => category.id !== id);

            return {
                categories: categories,
            };
        });
    },
    changeCategory: async (id, param, value, type) => {
        const reg = /^-?\d*(\.\d*)?$/;
        let realValue = null;
        if (type == "number" && reg.test(value)) realValue = Number(value);
        if (type == "text" || type == "select" || type == "file")
            realValue = value;

        if (realValue != null) changeCategory(id, { [param]: realValue });

        set((state) => {
            let categories = state.categories;
            let category = categories.find((category) => category.id === id);

            if (realValue != null) category[param] = realValue;

            return {
                categories: categories,
            };
        });
    },

    createPackageType: async () => {
        let packageType = { ...initPackageType };
        packageType = await createPackageType(packageType);

        set((state) => {
            let packageTypes = state.packageTypes;
            packageTypes.push(packageType);

            return {
                packageTypes: packageTypes,
            };
        });
    },
    deletePackageType: async (id) => {
        await deletePackageType(id);

        set((state) => {
            let packageTypes = state.packageTypes;

            packageTypes = packageTypes.filter(
                (packageType) => packageType.id !== id,
            );

            return {
                packageTypes: packageTypes,
            };
        });
    },
    changePackageType: async (id, param, value, type) => {
        const reg = /^-?\d*(\.\d*)?$/;
        let realValue = null;
        if (type == "number" && reg.test(value)) realValue = Number(value);
        if (type == "text" || type == "select" || type == "file")
            realValue = value;

        if (realValue != null) changePackageType(id, { [param]: realValue });

        set((state) => {
            let packageTypes = state.packageTypes;
            let packageType = packageTypes.find(
                (packageType) => packageType.id === id,
            );

            if (realValue != null) packageType[param] = realValue;

            return {
                packageTypes: packageTypes,
            };
        });
    },
}));
