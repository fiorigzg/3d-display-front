let productId = 100;
let categoryId = 200;
let packageTypeId = 300;

export function createProduct(product) {
    product.id = productId;
    console.log(`Product ${productId} created`);
    productId++;
    return product;
}

export function deleteProduct(id) {
    console.log(`Product ${id} deleted`);
}

export function changeProduct(id, product) {
    console.log(`Product ${id} changed`);
}

export function createCategory(category) {
    category.id = categoryId;
    console.log(`Category ${categoryId} created`);
    categoryId++;
    return category;
}

export function deleteCategory(id) {
    console.log(`Category ${id} deleted`);
}

export function changeCategory(id, category) {
    console.log(`Category ${id} changed`);
}

export function createPackageType(packageType) {
    packageType.id = packageTypeId;
    console.log(`PackageType ${packageTypeId} created`);
    packageTypeId++;
    return packageType;
}

export function deletePackageType(id) {
    console.log(`PackageType ${id} deleted`);
}

export function changePackageType(id, packageType) {
    console.log(`PackageType ${id} changed`);
}
