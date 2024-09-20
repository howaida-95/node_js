const mysql = require("mysql2");
/*
pass js obj with info about db engine in db host
*/
const pool = mysql.createPool({
    // define the host 
    host: "localhost",
    user: "root", // by default
    database: "new_schema",
    password: "1751995" // the password we assigned during installation
});

/*
promise() ==>
    allow us to use these promises when working with these connections
    handle asynchronous tasks 
    asynchronous data instead of callbacks 
    
*/
module.exports = pool.promise();