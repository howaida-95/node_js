const Sequelize = require("sequelize");
const sequelize = require("../util/database");
/*
order --> in-between table between
1. user --> to which the order belongs to 
2. multiple products --> those products have quantity attached to them   
*/
const Order = sequelize.define("order", {
    id: {
        type: Sequelize.INTEGER,
        autoIncrement: true,
        allowNull: false,
        primaryKey: true
    }
})
module.exports = Order;