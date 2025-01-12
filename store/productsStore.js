"use client";

import {
    initProduct,
    initCategory,
    initPackageType,
} from "constants/initValues";
import {
    createProduct,
    deleteProduct,
    changeProduct,
    createCategory,
    deleteCategory,
    changeCategory,
    createPackageType,
    deletePackageType,
    changePackageType,
} from "api/productsApi";

import { create } from "zustand";

export const useProductsStore = create((set) => ({
    products: [{ ...initProduct }],
    categories: [{ ...initCategory }],
    packageTypes: [{ ...initPackageType }],

    createProduct: (clientId) => {
        set((state) => {
            let products = state.products;
            let product = { ...initProduct };

            product.clientId = clientId;
            product = createProduct(product);
            products.push(product);

            return {
                products: products,
            };
        });
    },
    deleteProduct: (id) => {
        set((state) => {
            let products = state.products;

            products = products.filter((product) => product.id != id);
            deleteProduct(id);

            return {
                products: products,
            };
        });
    },
    changeProduct: (id, param, value, type) => {
        set((state) => {
            const reg = /^-?\d*(\.\d*)?$/;
            let products = state.products;
            let product = products.find((product) => product.id == id);

            let realValue = product[param];

            if (type == "number" && reg.test(value)) realValue = Number(value);
            if (type == "text" || type == "select" || type == "file")
                realValue = value;

            product[param] = realValue;
            changeProduct(id, product);

            return {
                products: products,
            };
        });
    },
    createCategory: () => {
        set((state) => {
            let categories = state.categories;
            let category = { ...initCategory };

            category = createCategory(category);
            categories.push(category);

            return {
                categories: categories,
            };
        });
    },
    deleteCategory: (id) => {
        set((state) => {
            let categories = state.categories;

            categories = categories.filter((category) => category.id !== id);
            deleteCategory(id);

            return {
                categories: categories,
            };
        });
    },
    changeCategory: (id, param, value, type) => {
        set((state) => {
            const reg = /^-?\d*(\.\d*)?$/;
            let categories = state.categories;
            let category = categories.find((category) => category.id === id);

            let realValue = category[param];

            if ((type == "number" || type == "select") && reg.test(value))
                realValue = Number(value);
            if (type == "text" || type == "file") realValue = value;

            category[param] = realValue;
            changeCategory(id, category);

            return {
                categories: categories,
            };
        });
    },
    createPackageType: () => {
        set((state) => {
            let packageTypes = state.packageTypes;
            let packageType = { ...initPackageType };

            packageType = createPackageType(packageType);
            packageTypes.push(packageType);

            return {
                packageTypes: packageTypes,
            };
        });
    },
    deletePackageType: (id) => {
        set((state) => {
            let packageTypes = state.packageTypes;

            packageTypes = packageTypes.filter(
                (packageType) => packageType.id !== id,
            );
            deletePackageType(id);

            return {
                packageTypes: packageTypes,
            };
        });
    },
    changePackageType: (id, param, value, type) => {
        set((state) => {
            const reg = /^-?\d*(\.\d*)?$/;
            let packageTypes = state.packageTypes;
            let packageType = packageTypes.find(
                (packageType) => packageType.id === id,
            );

            let realValue = packageType[param];

            if ((type == "number" || type == "select") && reg.test(value))
                realValue = Number(value);
            if (type == "text" || type == "file") realValue = value;

            packageType[param] = realValue;
            changePackageType(id, packageType);

            return {
                packageTypes: packageTypes,
            };
        });
    },
}));
