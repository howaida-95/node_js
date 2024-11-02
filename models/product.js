const { getDb } = require("../util/database"); // allow to access to db connection 
const mongodb = require("mongodb");

class Product {
    constructor(title, price, imageUrl, description) {
        this.title = title;
        this.price = price;
        this.imageUrl = imageUrl;
        this.description = description;
    }

    //^ ======================== post products ===========================
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

    //^ ======================== get products ===============================
    static fetchAll() {
        const db = getDb();
        // find({title: "bla bla"}) --> can used for filtering
        return db.collection("products").find().toArray() // get all documents and turn them into array (later we're gonna use pagination)
            .then((products) => {
                console.log(products, "products")
                return products;
            }).catch((err) => {
                console.log(err)
            })
    }

    //^ ======================== get single product =========================
    static findById(prodId) {
        const db = getDb(); // get access to db connection 
        return db.collection("products")
            .find({ _id: new mongodb.ObjectId(prodId) })// return all products that has this id (only one)
            .next() // get the last document returned by find
            .then(product => {
                console.log(product, "product")
                return product;
            })
            .catch(err => {
                console.log(err);
            });
    }



}

module.exports = Product;
