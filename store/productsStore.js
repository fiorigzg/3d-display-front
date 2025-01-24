"use client";

import {
    initProduct,
    initCategory,
    initPackageType,
} from "constants/initValues";
import { packageTypeFields, categoryFields } from "constants/fields";
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
import {
    getAll,
    createOne,
    deleteOne,
    checkValueType,
    changeOne,
} from "api/common";

import { create } from "zustand";

export const useProductsStore = create((set) => ({
    products: [],
    categories: {},
    packageTypes: {},

    initProducts: async () => {
        const products = await getProducts();
        set({ products: products });
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
        if (type == "select" || type == "file") realValue = value;
        if (type == "file") {
            realValue = file.name;
        }

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

    initCategories: async () => {
        const categories = await getAll(
            "/product_categories",
            "product_categories",
            categoryFields,
        );

        set((state) => {
            return { categories: categories };
        });
    },
    createCategory: async () => {
        let category = { ...initCategory };
        let id = await createOne(
            "/productcategory",
            "productcategory_id",
            category,
            categoryFields,
        );

        set((state) => {
            let categories = state.categories;
            categories[id] = category;
            return {
                categories: categories,
            };
        });
    },
    deleteCategory: async (id) => {
        await deleteOne(`/productcategory_${id}`);

        set((state) => {
            let categories = state.categories;
            delete categories[id];
            return {
                categories: categories,
            };
        });
    },
    changeCategory: async (id, param, value, type, isReq) => {
        let realValue = checkValueType(value, type);
        if (realValue != null) {
            if (isReq)
                await changeOne(
                    `/productcategory_${id}`,
                    { [param]: realValue },
                    categoryFields,
                );

            set((state) => {
                let categories = state.categories;
                let category = categories[id];
                category[param] = realValue;
                return {
                    categories: categories,
                };
            });
        }
    },

    initPackageTypes: async () => {
        const packageTypes = await getAll(
            "/packagingtypes",
            "packagingtypes",
            packageTypeFields,
        );

        for (let packageTypeId in packageTypes) {
            packageTypes[packageTypeId].object = "";
        }

        set((state) => {
            return { packageTypes: packageTypes };
        });
    },
    createPackageType: async () => {
        let packageType = { ...initPackageType };
        let id = await createOne(
            "/packagingtype",
            "packagingtype_id",
            packageType,
            packageTypeFields,
        );

        set((state) => {
            let packageTypes = state.packageTypes;
            packageTypes[id] = packageType;
            return {
                packageTypes: packageTypes,
            };
        });
    },
    deletePackageType: async (id) => {
        await deleteOne(`/packagingtype_${id}`);

        set((state) => {
            let packageTypes = state.packageTypes;
            delete packageTypes[id];
            return {
                packageTypes: packageTypes,
            };
        });
    },
    changePackageType: async (id, param, value, type, isReq) => {
        let realValue = checkValueType(value, type);
        if (realValue != null) {
            if (isReq)
                await changeOne(
                    `/packagingtype_${id}`,
                    { [param]: realValue },
                    packageTypeFields,
                );

            set((state) => {
                let packageTypes = state.packageTypes;
                let packageType = packageTypes[id];
                packageType[param] = realValue;
                return {
                    packageTypes: packageTypes,
                };
            });
        }
    },
    putPackageType: async (id, changes, isReq) => {
        if (isReq)
            await changeOne(`/packagingtype_${id}`, changes, packageTypeFields);

        set((state) => {
            let packageTypes = state.packageTypes;
            let packageType = packageTypes[id];
            for (let param in changes) {
                packageType[param] = changes[param];
            }
            return {
                packageTypes: packageTypes,
            };
        });
    },
}));
