const db = require("../util/database");
const Cart = require("./cart");

// -> creating class 
module.exports = class Product {

    constructor(id, title, imageUrl, price, description) {
        this.id = id;
        this.title = title;
        this.imageUrl = imageUrl;
        this.price = price;
        this.description = description;
    }

    save() {
        // we don't define id because it's auto generated 
        return db.execute("INSERT INTO products (title, price, imageUrl, description) VALUES(?, ?, ?, ?)",
            // order of elements here is the order of arguments
            [this.title, this.price, this.imageUrl, this.description]
        );
    }

    static deleteById(id) {
    }

    static fetchAll() {
        return db.execute("SELECT * FROM products");
    }

    static findById = (id) => {
        return db.execute("SELECT * FROM products WHERE products.id =?", [id])
    }

}
// call constructor with new & pass params to it 