/*
-> define a sequelize model with a user that has an id
id should have the same function as it has for the prod model 
user also has a name & email
*/
const Sequelize = require("sequelize");
const sequelize = require("../util/database");

/*
    1.model name 
    2. structure of the user -> {}
*/
const User = sequelize.define("user", {
    id: {
        type: Sequelize.INTEGER,
        autoIncrement: true,
        allowNull: false,
        primaryKey: true,
    },
    name: Sequelize.STRING,
    email: Sequelize.STRING,
})
module.exports = User;