const mongodb = require('mongodb');
const MongoClient = mongodb.MongoClient; // MongoClient used to connect mongodb 

// underscore _ ==> means that only used internally in this file 
let _db;

// This code defines a function `mongoConnect` that connects to a MongoDB database using the MongoDB client. 
// Upon a successful connection, it logs the result and invokes a callback function with the client object. 
// In case of an error during the connection, it logs the error message.

const mongoConnect = (callback) => {
    MongoClient.connect(
        "mongodb+srv://howaidasayed95:1751995@firstapi.7v1ba.mongodb.net/?retryWrites=true&w=majority&appName=firstapi"
    )
        .then((client) => {
            // client obj --> give me access to database
            //console.log(res, "res");
            _db = client.db(); // store connection to db variable
            callback();
        }).catch((err) => {
            console.log(err, "err");
            throw err;
        })
}

const getDb = () => {
    if (_db) {
        return _db; // return db -> return access to db 
    }
    throw "No database found"
}
//module.exports = mongoConnect;
/* 
This module exports two functions: 
1. mongoConnect
================ 
which are likely used for 
connecting to a MongoDB database & store this connection to database 

2.getDb
========
retrieving the database instance, respectively.
return access to that connection to db if that exist

==> mongodb will manage that elegantly with -> connection pool 
mongodb provides sufficient connections for multiple simultaneous interactions with the db 

==> according to that need to adjust app.js 

mongoConnect(client => {
    console.log(client);
    app.listen(3000);
});

here we don't get client anymore 
*/

exports.mongoConnect = mongoConnect;
exports.getDb = getDb;

/*
bad way to connect to mongoDB
=============================
this will connect mongodb for every operation
so this isn't a good way for connecting to mongodb
since we want to connect to it from different places in our app 

good way
========
manage one connection in our database 
then return access to the client 
from different places in our app the need access
*/