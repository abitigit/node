/**
 * Task 2
 */

const fs = require('fs');
const path = require('path');
const { validationErrorMessages } = require('./constants');

/**
 * Get all products from data paths
 * @param {Array} dataPaths - Array of file paths
 */
function getAllProducts(dataPath) {
    const productsData = fs.readFileSync(dataPath, 'utf-8');
    return JSON.parse(productsData).products;
}

/**
 * Update expiry date of the item
 * @param {Number} itemId - Item id
 * @param {String} expiryDate - Expiry date in ISO8601 format
 */
async function updateExpiryDateByItemId(itemId, expiryDate, dataPaths) {
    if (!Number.isInteger(itemId) || itemId <= 0) {
        throw new Error(validationErrorMessages.itemIdValidation);
    }

    const products = getAllProducts(dataPaths);
    let productFound;

    for (const product of products) {
        const item = product.items.find((item) => item.item_id === itemId);

        if (item) {
            item.expiry_date = expiryDate;
            productFound = product;
            break;
        }
    }

    if (!productFound) {
        throw new Error(validationErrorMessages.itemNotFound);
    }

    productFound.items = productFound.items.filter(item => item.item_id === itemId);

    return productFound;
}

module.exports = {
    updateExpiryDateByItemId,
};

/**
 * TIP: Use the following code to test your implementation.
 * You can change the itemId and expiryDate that is passed to
 * the function to test different use cases/scenarios
 */
(async () => {
  try {
    const filePath = path.resolve(__dirname, "./data/task2/update_item_products.json");
    const product = await updateExpiryDateByItemId(142, "2022-01-01", filePath);
    console.log(JSON.stringify(product, null, 3));
  } catch (err) {
    console.error(err);
  }
})();

module.exports = {
  updateExpiryDateByItemId,
};
