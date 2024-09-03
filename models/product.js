const fs = require("fs");
// we use path --> because the file should be created in special path 
const path = require("path");
// -> creating constructor function
// module.exports = function Product(){

// }

// -> creating class 
module.exports = class Product {
    // define a shape of product 
    constructor(t) {
        this.title = t;
    }

    // this --> refer to the object created based on the class
    // save it to a file 
    save() {
        // create a path -> (root directory) / data folder / file name(products)
        const p = path.join(path.dirname(require.main.filename), "data", "products.json");
        /* get the existing array of products 
            - read that file using readFile (we can read them as streams)
            - 
        */
        fs.readFile(p, (err, fileContent) => {
            console.log(err, "===============");
            // creating a new products array 
            let products = [];
            if (!err) {
                // read products from the file if there's no error (like file path not found)
                products = JSON.parse(fileContent);
            }
            // this refers to the class in case arrow function
            products.push(this);
            // write in the same path we read from , convert into json using JSON.stringify
            fs.writeFile(p, JSON.stringify(products), err => {
                console.log(err, "err")
            });
        });
    }

    // retrieve product from this array
    // static --> to call this method inside the class itself 
    static fetchAll() {
        const p = path.join(path.dirname(require.main.filename), "data", "products.json");
        fs.readFile(p, (err, fileContent) => {
            if (err) {
                return [];
            }
            return JSON.parse(fileContent);
        })
        return
    }
}
// call constructor with new & pass params to it 