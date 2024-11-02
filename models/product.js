const { getDb } = require("../util/database"); // allow to access to db connection 

class Product {
    constructor(title, price, imageUrl, description) {
        this.title = title;
        this.price = price;
        this.imageUrl = imageUrl;
        this.description = description;
    }

    // connect to mongo db & save product 
    save() {
        const db = getDb(); // return db instance we connected to
        /* tell mongodb in which collection you want to insert something 
        if collection not exist yet, it will created once we insert data 
        insert 
        ------
        1.insertOne({}) --> insert one document (insert js obj -> but converted into json by mongodb)
        2.insertMany([]) --> insert many documents at once  (takes array of js objects)

        */
        return db.collection("products")
            .insertOne(this) // this --> refers to produce since we insert the product
            .then((result) => {
                console.log(result, "result");
            }).catch((err) => {
                console.log(err)
            })
    }
}

module.exports = Product;
