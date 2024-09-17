const fs = require("fs");
// we use path --> because the file should be created in special path 
const path = require("path");
// -> creating constructor function
// module.exports = function Product(){
// }
const Cart = require("./cart");
const p = path.join(path.dirname(require.main.filename), "data", "products.json");
const getProductsFromFile = (cb) => {
    fs.readFile(p, (err, fileContent) => {
        if (err) {
            cb([]);
        } else {
            cb(JSON.parse(fileContent));
        }
    })
}

// -> creating class 
module.exports = class Product {
    // define a shape of product 
    constructor(id, title, imageUrl, price, description) {
        this.id = id;
        this.title = title;
        this.imageUrl = imageUrl;
        this.price = price;
        this.description = description;
    }

    // this --> refer to the object created based on the class
    // save it to a file 
    // use save for add & edit 
    save() {
        if (this.id) {
            // update the existing product
            //1.find the product 
            getProductsFromFile((products) => {
                const existingProductIndex = products.findIndex(prod => prod.id === this.id);
                //2.replace the product
                const updatedProducts = [...products];
                updatedProducts[existingProductIndex] = this;
                fs.writeFile(p, JSON.stringify(updatedProducts), err => {
                    console.log(err, "err updatedProducts")
                });
            })
        }
        // add id to the product object 
        this.id = Math.random().toString();
        getProductsFromFile((products) => {
            products.push(this); // append new product 
            console.log(this, "this--------")
            // write in the same path we read from , convert into json using JSON.stringify
            fs.writeFile(p, JSON.stringify(products), err => {
                console.log(err, "err")
            });
        })
    }

    // delete 
    static deleteById(id) {
        getProductsFromFile((products) => {
            const product = products.find(prod => prod.id == id);
            const updatedProducts = products.filter(prod => prod.id !== id);
            fs.writeFile(p, JSON.stringify(updatedProducts), (err) => {
                if (!err) {
                    Cart.deleteProduct(id, product?.price);
                }
            });
        })
    }

    /*
        retrieve product from this array
        static --> to call this method inside the class itself 
        cb --> callback allow to pass a func that fetchAll will execute once its done
        so calling fetchAll can pass a func then called returning the data 
    */
    static fetchAll(cb) {
        getProductsFromFile(cb);
    }

    static findById = (id, cb) => {
        getProductsFromFile(products => {
            const product = products.find(item => item.id == id)
            cb(product);
        });
    }

}
// call constructor with new & pass params to it 