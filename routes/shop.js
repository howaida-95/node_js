//!  ================== imports starts ================== 
const productsController = require("../controllers/products");

//!  ================== imports end =====================
const express = require("express");
const router = express.Router();

router.get("/", productsController.getProducts);
module.exports = router;