// import mongodb client
const { getDb } = require("../util/database");
const mongodb = require("mongodb");
const objectId = mongodb.ObjectId;
class User {
    constructor(username, email) {
        this.name = username;
        this.email = email;
    }
    // save this user to the database 
    save() {
        const db = getDb();
        return db.collection("users").insertOne(this) // this --> js obj {name: "", email: ""}
    }

    // find user by id
    static findById(userId) {
        const db = getDb();
        return db.collection("users").findOne({ _id: new objectId(userId) });
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