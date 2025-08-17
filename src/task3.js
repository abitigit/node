/**
 * Task 3
 */
const fs = require("fs");
const path = require("path");
const moment = require("moment");
const { validationErrorMessages } = require("./constants");

function getAllProducts(dataPath) {
    const productsData = fs.readFileSync(dataPath, 'utf-8');
    return JSON.parse(productsData).products;
}

/**
 * Add item to a product
 * @param {Number} productId - Product id
 * @param {Object} item - { id: 1010, expiry_date: "2050-03-30T12:57:07.846Z" }
 * @param {Object} dataPath - Data path
 */
async function addItem(productId, item, dataPath) {
    if (!Number.isInteger(productId) || productId <= 0) {
        throw new Error(validationErrorMessages.productIdValidation);
    }

    if (!item || typeof item !== 'object' || !item.id || !item.expiry_date) {
        throw new Error(validationErrorMessages.itemValidation);
    }

    const products = getAllProducts(dataPath);
    const product = products.find(p => p.id === productId);

    if (!product) {
        throw new Error(validationErrorMessages.productNotFound);
    }

    const itemExists = product.items.some(i => i.item_id === item.id);
    if (itemExists) {
        throw new Error(validationErrorMessages.itemAlreadyExists);
    }

    const expiryDate = new Date(item.expiry_date);
    if (expiryDate <= new Date()) {
        throw new Error(validationErrorMessages.itemExpired);
    }

    product.items.push({ item_id: item.id, expiry_date: item.expiry_date });
    product.items_left += 1;

    product.items.sort((a, b) => a.item_id - b.item_id);

    return product;
}

/**
 * TIP: Use the following code to test your implementation
 * Use different values for input parameters to test different scenarios
 */
(async () => {
  try {
    const dataPath = path.resolve(__dirname, "./data/task3/products.json");
    const result = await addItem(4, {
      id: 410,
      expiry_date: "2050-03-30T12:57:07.846Z",
    }, dataPath);
    console.log(result);
  } catch (err) {
    console.error(err);
  }
})();

module.exports = {
  addItem,
};
