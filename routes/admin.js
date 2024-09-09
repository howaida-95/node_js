//!========== imports start ===================
const path = require("path");
const bodyParser = require("body-parser");
const express = require("express");
const adminController = require("../controllers/admin");
const router = express.Router();
//!========== imports end =====================

// admin/add-product ==> GET
router.get("/add-product", adminController.getAddProduct);
// admin/add-product ==> POST
router.post("/add-product", adminController.postAddProduct);

router.get("/edit-product/:productId", adminController.getEditProduct)
// no dynamic segment because it's gonna be sent to 
router.post("/edit-product", adminController.postEditProduct);

router.get("/products", adminController.getProducts);

module.exports = router;
//exports.routes = router;