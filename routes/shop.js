//!  ================== imports starts ================== 
const shopController = require("../controllers/shop");

//!  ================== imports end =====================
const express = require("express");
const router = express.Router();

router.get("/", shopController.getIndex);
router.get("/products", shopController.getProducts);
// single product 
router.get("/cart", shopController.getCart);
router.get("/checkout", shopController.getCheckout);

module.exports = router;