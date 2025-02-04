"use client";

import { create } from "zustand";

import {
    initProduct,
    initCategory,
    initPackageType,
} from "constants/initValues";
import {
    packageTypeFields,
    categoryFields,
    productFields,
} from "constants/fields";
import {
    getAll,
    createOne,
    copyOne,
    deleteOne,
    checkValueType,
    changeOne,
} from "api/common";

export const useProductsStore = create((set) => ({
    products: {},
    categories: {},
    packageTypes: {},

    initProducts: async (clientId) => {
        const products = await getAll(
            `/productsbyclient?client_id=${clientId}`,
            "products",
            productFields,
        );

        set((state) => {
            return { products: { ...state.products, [clientId]: products } };
        });
    },
    createProduct: async (clientId) => {
        let product = {
            ...initProduct,
            clientId: clientId,
            packagingX: 0,
            packagingY: 0,
            packagingZ: 0,
            packagingObj: "",
        };
        let id = await createOne(
            "/product",
            "product_id",
            product,
            productFields,
        );

        set((state) => {
            let products = state.products;
            if (!products[clientId]) products[clientId] = {};
            products[clientId][id] = product;
            return {
                products: products,
            };
        });
    },

    deleteProduct: async (clientId, id) => {
        await deleteOne(`/product_${id}`);

        set((state) => {
            let products = state.products;
            delete products[clientId][id];
            return {
                products: products,
            };
        });
    },
    changeProduct: async (clientId, id, param, value, type, isReq) => {
        let realValue = checkValueType(value, type);
        if (realValue != null) {
            if (isReq)
                await changeOne(
                    `/product_${id}`,
                    {
                        [param]: realValue,
                        packagingX: 0,
                        packagingY: 0,
                        packagingZ: 0,
                        packagingObj: "",
                    },
                    productFields,
                );

            set((state) => {
                let products = state.products;
                let product = products[clientId][id];
                product[param] = realValue;
                return {
                    products: products,
                };
            });
        }
    },
    copyProduct: async (clientId, id) => {
        const copiedId = await copyOne(`/product_${id}`, productFields);

        set((state) => {
            let products = state.products;
            let product = { ...products[clientId][id] };
            products[clientId][copiedId] = product;
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
    copyCategory: async (id) => {
        const copiedId = await copyOne(
            `/productcategory_${id}`,
            categoryFields,
        );

        set((state) => {
            let categories = state.categories;
            let category = { ...categories[id] };
            categories[copiedId] = category;
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
    copyPackageType: async (id) => {
        const copiedId = await copyOne(
            `/packagingtype_${id}`,
            packageTypeFields,
        );

        set((state) => {
            let packageTypes = state.packageTypes;
            let packageType = { ...packageTypes[id] };
            packageTypes[copiedId] = packageType;
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
