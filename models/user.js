// import mongodb client
const { getDb } = require("../util/database");
const mongodb = require("mongodb");
const objectId = mongodb.ObjectId;

class User {
    constructor(username, email, cart, id) {
        this.name = username;
        this.email = email;
        this.cart = cart; // cart is object with some items --> {items: []}
        this._id = id;
    }
    // save this user to the database 
    save() {
        const db = getDb();
        return db.collection("users").insertOne(this) // this --> js obj {name: "", email: ""}
    }

    // find user by id
    static findById(userId) {
        const db = getDb();
        return db.collection("users").findOne({ _id: new objectId(userId) }).then(user => {
            return user;
        }).catch((err) => {
            console.log(err);
            return userId;
        });
    }

    //^ ==================================== cart ====================================
    // add to cart 
    addToCart(product) {
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
            updatedCartItems.push({ productId: new objectId(product._id), quantity: newQuantity })
        }

        const updatedCart = {
            items: updatedCartItems
        }
        // update the user to store the cart at there 
        const db = getDb();
        return db.collection("users").updateOne(
            { _id: new objectId(this._id) },
            // overwrite old cart with a new cart
            { $set: { cart: updatedCart } }
        );
    }

    // get cart 
    getCart() {
        // products with respective quantities  
        // get cart that exists on the user 
        //return this.cart;
        // get populated cart 

        const db = getDb();
        /* find all the products in the cart
        to find a content
        $in operator --> takes an array of ids 
        each id in array will be accepted & get back a cursor  
        */
        const productIds = this.cart.items.map((item) => {
            return item.productId;
        });
        console.log(
            db.collection("products").find({
                _id: { $in: productIds }
            }),
            "products products products products"
        )
        return db.collection("products").find({
            // return all elements which their ids are here in that array
            _id: { $in: productIds }
        })
            .toArray()
            .then((products) => {
                return products.map((p) => {
                    return {
                        ...p,
                        quantity: this.cart.items.find(item => {
                            return item.productId.toString() === p._id.toString();
                        })
                    }
                });
            })
            .catch((error) => {
                console.log(error)
            });
    }

    // delete cart product 
    deleteItemFromCart = (productId) => {
        // keep all items except the one we're deleting 
        const updatedCartItems = this.cart.items.filter((item) => {
            return item.productId.toString() !== productId.toString();
        })
        const db = getDb();
        return db.collection("users")
            .updateOne(
                { _id: new objectId(this._id) },
                // this now updates the cart
                { $set: { cart: { items: updatedCartItems } } }
            )
    }
}
module.exports = User;

/*
important notes
===============
----> Instance Methods (Without static):
=========================================
- These methods are intended to be used on instances (objects) of the class.
- They require you to create an instance of the class to call them
- These methods can access both instance-specific data (via this) and class data.
ex:
const user = new User("Alice", "alice@example.com");
user.save(); // Saves Alice to the database

---> static Methods (With static):
===================================
- not tied to a specific instance; instead, they belong to the class itself
- They cannot access instance properties directly using this because they are not called on an instance.
- These methods are useful for utility functions or operations that don't need instance-specific data, like looking up users in a database without needing to create an instance first.
ex:
static findById(userId) {
    // Code to find a user by ID
}
User.findById("someUserId"); // Finds a user by ID
------------------------------------------------------------
When to Use Each
=================
Use an instance method when you need to manipulate or access data specific to an instance.
Use a static method when the functionality is relevant to the class as a whole and doesn’t depend on instance-specific properties.
*/