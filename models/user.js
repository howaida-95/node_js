const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const userSchema = new Schema({
    // how the user should look like
    name: {
        type: String,
        required: true,
    },
    email: {
        type: String,
        required: true,
    },
    cart: {
        // array of documents (embedded document)
        items: [{
            productId: {
                type: Schema.Types.ObjectId,
                required: true,
                ref: "Product"
            },
            quantity: {
                type: Number,
                required: true
            }
        }],
    },
})

/*
methods key is an object that allows to add our own methods 
*/
userSchema.methods.addToCart = function (product) {
    /* 1. check if this product is already inside the cart --> increase the quantity */
    // find the index of the product with the same id of the added product
    const cartProductIndex = this.cart?.items?.findIndex((cp) => {
        return cp.productId.toString() === product._id.toString(); // index or -1 (if not exist)
    });

    // 2. add quantity field
    let newQuantity = 1;
    const updatedCartItems = [...this.cart.items]; // new array with all items in the cart
    if (cartProductIndex >= 0) {
        newQuantity = this.cart.items[cartProductIndex].quantity + 1;
        updatedCartItems[cartProductIndex].quantity = newQuantity; // edit the array without touching the old array
    } else {
        updatedCartItems.push(
            {
                // the names used in schema --> productId & quantity
                productId: product._id,
                quantity: newQuantity
            });
    }

    const updatedCart = {
        items: updatedCartItems,
    };
    this.cart = updatedCart;
    // update the user to store the cart at there
    return this.save()
}
module.exports = mongoose.model("User", userSchema);

// // import mongodb client
// const { getDb } = require("../util/database");
// const mongodb = require("mongodb");
// const objectId = mongodb.ObjectId;

// class User {
//     constructor(username, email, cart, id) {
//         this.name = username;
//         this.email = email;
//         this.cart = cart; // cart is object with some items --> {items: []}
//         this._id = id; // user id
//     }
//     // save this user to the database
//     save() {
//         const db = getDb();
//         return db.collection("users").insertOne(this); // this --> js obj {name: "", email: ""}
//     }

//     // find user by id
//     static findById(userId) {
//         const db = getDb();
//         return db
//             .collection("users")
//             .findOne({ _id: new objectId(userId) })
//             .then((user) => {
//                 return user;
//             })
//             .catch((err) => {
//                 console.log(err);
//                 return userId;
//             });
//     }

//     //^ ==================================== cart ====================================
//     // add to cart


//     // get cart
//     getCart() {
//         const db = getDb();
//         const productIds = this.cart.items.map((item) => {
//             return item.productId;
//         });
//         console.log(
//             db.collection("products").find({
//                 _id: { $in: productIds },
//             }),
//             "products products products products"
//         );
//         return db
//             .collection("products")
//             .find({
//                 _id: { $in: productIds },
//             })
//             .toArray()
//             .then((products) => {
//                 return products.map((p) => {
//                     return {
//                         ...p,
//                         quantity: this.cart.items.find((item) => {
//                             return item.productId.toString() === p._id.toString();
//                         }),
//                     };
//                 });
//             })
//             .catch((error) => {
//                 console.log(error);
//             });
//     }

//     // delete cart product
//     deleteItemFromCart = (productId) => {
//         // keep all items except the one we're deleting
//         const updatedCartItems = this.cart.items.filter((item) => {
//             return item.productId.toString() !== productId.toString();
//         });
//         const db = getDb();
//         return db.collection("users").updateOne(
//             { _id: new objectId(this._id) },
//             // this now updates the cart
//             { $set: { cart: { items: updatedCartItems } } }
//         );
//     };

//     //^ ==================================== orders ====================================
//     // add orders to the users
//     addOrder() {
//         const db = getDb();
//         return this.getCart()
//             .then((products) => {
//                 // products contain products info & quantity
//                 const order = {
//                     items: products,
//                     user: {
//                         _id: new objectId(this._id),
//                         name: this.name,
//                         //email: this.email
//                     },
//                 };
//                 return db.collection("orders").insertOne(order);
//             })
//             .then((result) => {
//                 // clear the cart in user object
//                 this.cart = { items: [] };
//                 // clear the cart in db
//                 db.collection("users").updateOne(
//                     { _id: new objectId(this._id) },
//                     // this now updates the cart
//                     { $set: { cart: { items: [] } } }
//                 );
//             })
//             .catch((error) => {
//                 console.log(error);
//             });
//     }

//     // get orders
//     getOrders() {
//         const db = getDb();
//         return db.collection("orders")
//             .find({ "user._id": new objectId(this._id) })
//             .toArray();// return array of orders to that user
//     }
// }









