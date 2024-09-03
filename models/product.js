const fs = require("fs");
// we use path --> because the file should be created in special path 
const path = require("path");
// -> creating constructor function
// module.exports = function Product(){
// }

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
    constructor(t) {
        this.title = t;
    }

    // this --> refer to the object created based on the class
    // save it to a file 
    save() {
        getProductsFromFile((products) => {
            products.push(this); // append new product 
            console.log(this, "this--------")
            // write in the same path we read from , convert into json using JSON.stringify
            fs.writeFile(p, JSON.stringify(products), err => {
                console.log(err, "err")
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
}
// call constructor with new & pass params to it 