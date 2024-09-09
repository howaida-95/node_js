const fs = require("fs");
const path = require("path");

const p = path.join(path.dirname(require.main.filename), "data", "cart.json");

// -> creating class 
module.exports = class Cart {
    // // define a shape of cart
    // constructor(title, imageUrl, price, description) {
    //     this.products = [];
    //     this.totalPrice = 0; // increase with every product we add 
    // }

    // a way to add & remove products 
    static addProduct(id, productPrice) {
        // fetch the previous cart 
        fs.readFile(p, (err, fileContent) => {
            let cart = { products: [], totalPrice: 0 }
            // this check because initially the file not found
            if (!err) {
                cart = JSON.parse(fileContent);
            }
            // analyze the cart & see if we have that product --> find the existing product 
            const existingProductIndex = cart.products.findIndex(prod => prod.id == id);
            const existingProduct = cart.products[existingProductIndex];
            let updatedProduct;
            if (existingProduct) {
                updatedProduct = { ...existingProduct };
                updatedProduct.qty = updatedProduct.qty + 1;
                cart.products = [...cart.products];
                // replace the item with the updated product
                cart.products[existingProductIndex] = updatedProduct;
            } else {
                // add info for this product
                updatedProduct = { id: id, qty: 1 };
                // adding new product 
                cart.products = [...cart.products, updatedProduct];
            }
            // + -> to convert it into number 
            cart.totalPrice = cart.totalPrice + +productPrice;
            fs.writeFile(p, JSON.stringify(cart), (err) => {
                console.log(err, "error");
            });
        })
        // add new product or increase the quantity     
    }
}

