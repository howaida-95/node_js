const { getDb } = require("../util/database"); // allow to access to db connection 
const mongodb = require("mongodb");

class Product {
    constructor(title, price, imageUrl, description, id) {
        this.title = title;
        this.price = price;
        this.imageUrl = imageUrl;
        this.description = description;
        this._id = new mongodb.ObjectId(id);
    }

    //^ ======================== post & edit products ===========================
    // connect to mongo db & save product 
    save() {
        /*
            updateOne() - updateMany()
            insertOne() - insertMany()
        */
        const db = getDb();
        let dbOp;
        if (this._id) {
            /* update the product 
            updateOne -> takes 2 args:
                1- filter ==> defines which element or document we want to update 
                2- {$set: } ==> specify how to update that document
            */
            dbOp = db.collection("products").updateOne(
                { _id: this._id },
                { $set: this }
            );
        } else {
            return dbOp = db.collection("products")
                .insertOne(this)
        }
        return dbOp.then((result) => {
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

    //^ ======================== delete product =============================
    static deleteById(prodId) {
        const db = getDb();
        /*
            deleteOne
            deleteMany
        */
        return db.collection("products").deleteOne({ _id: new mongodb.ObjectId(prodId) })
            .then((result) => {
                console.log(result, "result");
            }).catch((err) => {
                console.log(err)
            })
    }
}

module.exports = Product;
/*
    insertOne - insertMany 
    updateOne - updateMany
    deleteOne - deleteMany
*/