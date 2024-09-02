//!========== imports start ===================
const path = require("path");
const bodyParser = require("body-parser");
const express = require("express");
const productsController = require("../controllers/products");
const router = express.Router();
//!========== imports end =====================

// admin/add-product ==> GET
router.get("/add-product", productsController.getAddProduct);

// admin/add-product ==> POST
router.post("/add-product", productsController.postAddProduct);

module.exports = router;
//exports.routes = router;