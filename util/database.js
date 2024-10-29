const mongodb = require('mongodb');
const MongoClient = mongodb.MongoClient; // MongoClient used to connect mongodb 
// This code defines a function `mongoConnect` that connects to a MongoDB database using the MongoDB client. 
// Upon a successful connection, it logs the result and invokes a callback function with the client object. 
// In case of an error during the connection, it logs the error message.

const mongoConnect = (callback) => {
    MongoClient.connect("mongodb+srv://howaida:1751995@cluster0.awxto.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0")
        .then((client) => {
            // client obj --> give me access to database
            console.log(res, "res");
            callback(client);
        }).catch((err) => {
            console.log(err, "err");
        })
}
module.exports = mongoConnect;

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