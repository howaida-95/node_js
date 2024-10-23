const mongodb = require('mongodb');
const MongoClient = mongodb.MongoClient; // MongoClient used to connect mongodb 

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




