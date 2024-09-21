// const mysql = require("mysql2");
// const pool = mysql.createPool({
//     host: "localhost",
//     user: "root",
//     database: "new_schema",
//     password: "1751995"
// });

// module.exports = pool.promise();

const Sequelize = require("sequelize");
// db name, user name (by default root), password
const sequelize = new Sequelize(
    "new_schema",
    "root",
    "1751995",
    { dialect: "mysql", host: "localhost" }
);

module.exports = sequelize;