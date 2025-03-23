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
} from "api/commonApi";
import { useSaveStore } from "./saveStore";

export const useProductsStore = create((set, get) => ({
    products: {},
    newProductId: 0,
    productImages: {},
    categories: {},
    newCategoryId: 0,
    packageTypes: {},
    newPackageTypeId: 0,

    getAllProducts: async () => {
        const products = await getAll("/products", "products", productFields);
        let realProducts = {};

        for (const productId in products) {
            const product = products[productId];

            if (!(product.clientId in realProducts))
                realProducts[product.clientId] = {};
            realProducts[product.clientId][productId] = product;
        }

        set((state) => {
            return { products: realProducts };
        });
    },
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
        const newProductId = get().newProductId + 1;
        await useSaveStore
            .getState()
            .createOne("product", "$" + newProductId, product, productFields);

        set((state) => {
            let products = state.products;
            if (!products[clientId]) products[clientId] = {};
            products[clientId]["$" + newProductId] = product;
            return {
                newProductId: newProductId,
                products: products,
            };
        });
    },
    copyProduct: async (clientId, id) => {
        // const newIds = await copyOne("product", id);
        // const newId = newIds.find((el) => el.type == "product").id;
        // set((state) => {
        //     let products = state.products;
        //     let product = { ...products[clientId][id] };
        //     products[clientId][newId] = product;
        //     return {
        //         products: products,
        //     };
        // });
    },
    deleteProduct: async (clientId, id) => {
        await useSaveStore.getState().deleteOne("product", id);

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
                await useSaveStore.getState().changeOne(
                    "product",
                    id,
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
    getProductImage: async (id) => {},

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
        const newCategoryId = get().newCategoryId + 1;
        await useSaveStore
            .getState()
            .createOne(
                "category",
                "$" + newCategoryId,
                category,
                categoryFields,
            );

        set((state) => {
            let categories = state.categories;
            categories["$" + newCategoryId] = category;
            return {
                newCategoryId: newCategoryId,
                categories: categories,
            };
        });
    },
    copyCategory: async (id) => {
        // const newIds = await copyOne("product_category", id);
        // const newId = newIds.find((el) => el.type == "product_category").id;
        // set((state) => {
        //     let categories = state.categories;
        //     let category = { ...categories[id] };
        //     categories[newId] = category;
        //     return {
        //         categories: categories,
        //     };
        // });
    },
    deleteCategory: async (id) => {
        await useSaveStore.getState().deleteOne("category", id);

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
                await useSaveStore
                    .getState()
                    .changeOne(
                        "category",
                        id,
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
            if (packageTypes[packageTypeId].object == null)
                packageTypes[packageTypeId].object = "";
        }

        set((state) => {
            return { packageTypes: packageTypes };
        });
    },
    createPackageType: async () => {
        let packageType = { ...initPackageType };
        const newPackageTypeId = get().newPackageTypeId + 1;
        await useSaveStore
            .getState()
            .createOne(
                "packageType",
                "$" + newPackageTypeId,
                packageType,
                packageTypeFields,
            );

        set((state) => {
            let packageTypes = state.packageTypes;
            packageTypes["$" + newPackageTypeId] = packageType;
            return {
                newPackageTypeId: newPackageTypeId,
                packageTypes: packageTypes,
            };
        });
    },
    copyPackageType: async (id) => {
        // const newIds = await copyOne("packaging_type", id);
        // const newId = newIds.find((el) => el.type == "packaging_type").id;
        // set((state) => {
        //     let packageTypes = state.packageTypes;
        //     let packageType = { ...packageTypes[id] };
        //     packageTypes[newId] = packageType;
        //     return {
        //         packageTypes: packageTypes,
        //     };
        // });
    },
    deletePackageType: async (id) => {
        await useSaveStore.getState().deleteOne("packageType", id);

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
                await useSaveStore
                    .getState()
                    .changeOne(
                        "packageType",
                        id,
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
            await useSaveStore
                .getState()
                .changeOne("packageType", id, changes, packageTypeFields);
        console.log(changes);

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
