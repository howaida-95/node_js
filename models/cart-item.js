
const Sequelize = require("sequelize");
const sequelize = require("../util/database");

const CartItem = sequelize.define("cartItem", {
    id: {
        type: Sequelize.INTEGER,
        autoIncrement: true,
        allowNull: false,
        primaryKey: true
    },
    quantity: Sequelize.INTEGER,
})

module.exports = CartItem;

/* 
cart should belong to a a single user 
cart table should hold different carts for different users
*/