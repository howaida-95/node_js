const Sequelize = require("sequelize");
const sequelize = require("../util/database");


const Cart = sequelize.define("cart", {
    id: {
        type: Sequelize.INTEGER,
        autoIncrement: true,
        allowNull: false,
        primaryKey: true
    }
})

module.exports = Cart;

/* 
cart should belong to a a single user 
cart table should hold different carts for different users
*/