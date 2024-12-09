const mongoose = require("mongoose");
// schema constructor to create schema 
const Schema = mongoose.Schema;

/*
mongoose is schemaless 
to focus in your data -> should know how your data look like
*/
const productSchema = new Schema({
    // _id not added because it will be added automatically 
    // define type & key
    title: {
        type: String,
        required: true,
    },
    price: {
        type: Number,
        required: true,
    },
    description: {
        type: String,
        required: true,
    },
    imgUrl: {
        type: String,
        required: true,
    },
});

/*
model (entity name , schema)
is important for mongoose behind the scenes to connect a schema (blueprint)
==> mongoose takes the name --> lowercase --> plural
*/
module.exports = mongoose.model("Product", productSchema);


// const { getDb } = require("../util/database"); // allow to access to db connection
// const mongodb = require("mongodb");

// class Product {
//     constructor(title, price, imageUrl, description, id, userId) {
//         this.title = title;
//         this.price = price;
//         this.imageUrl = imageUrl;
//         this.description = description;
//         this._id = id ? new mongodb.ObjectId(id) : null;
//         /*
//             only store user_id to know who is connected
//             so when we create a new product we can pass a user_id
//         */
//         this.userId = userId;
//     }

//     //^ ======================== post & edit products =======================
//     // connect to mongo db & save product
//     save() {
//         /*
//             updateOne() - updateMany()
//             insertOne() - insertMany()
//             -------------------------------------------------
//             when saving a product store a reference to a user
//         */
//         const db = getDb();
//         let dbOp;
//         if (this._id) {
//             /* update the product
//             updateOne -> takes 2 args:
//                 1- filter ==> defines which element or document we want to update
//                 2- {$set: } ==> specify how to update that document
//             */
//             dbOp = db.collection("products")
//                 .updateOne(
//                     { _id: this._id },
//                     { $set: this }
//                 );
//         } else {
//             dbOp = db.collection("products")
//                 .insertOne(this)
//         }
//         return dbOp.then((result) => {
//             console.log(result, "result");
//         }).catch((err) => {
//             console.log(err)
//         })
//     }

//     //^ ======================== get products ===============================
//     static fetchAll() {
//         const db = getDb();
//         // find({title: "bla bla"}) --> can used for filtering
//         return db.collection("products").find().toArray() // get all documents and turn them into array (later we're gonna use pagination)
//             .then((products) => {
//                 console.log(products, "products")
//                 return products;
//             }).catch((err) => {
//                 console.log(err)
//             })
//     }

//     //^ ======================== get single product =========================
//     static findById(prodId) {
//         const db = getDb(); // get access to db connection
//         return db.collection("products")
//             .find({ _id: new mongodb.ObjectId(prodId) })// return all products that has this id (only one)
//             .next() // get the last document returned by find
//             .then(product => {
//                 console.log(product, "product")
//                 return product;
//             })
//             .catch(err => {
//                 console.log(err);
//             });
//     }

//     //^ ======================== delete product =============================
//     static deleteById(prodId) {
//         const db = getDb();
//         /*
//             deleteOne
//             deleteMany
//         */
//         return db.collection("products").deleteOne({ _id: new mongodb.ObjectId(prodId) })
//             .then((result) => {
//                 console.log(result, "result");
//             }).catch((err) => {
//                 console.log(err)
//             })
//     }
// }

// module.exports = Product;
// /*
//     insertOne - insertMany
//     updateOne - updateMany
//     deleteOne - deleteMany
//     findOne /find({_id: new mongodb.ObjectId(id)}) - find
// */