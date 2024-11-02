//!  ================== imports starts ================== 
const shopController = require("../controllers/shop");

//!  ================== imports end =====================
const express = require("express");
const router = express.Router();

router.get("/", shopController.getIndex);
router.get("/products", shopController.getProducts);
// single product --> variable segment
// note -> order matters specific route comes before dynamic route
// router.get("/products/:productId", shopController.getProduct);

// router.get("/cart", shopController.getCart);
// router.post("/cart", shopController.postCart);
// router.post("/cart-delete-item", shopController.postCartDeleteProduct);
// router.get("/checkout", shopController.getCheckout);
// router.get("/orders", shopController.getOrders);
// router.post("/create-order", shopController.postOrders);

module.exports = router;