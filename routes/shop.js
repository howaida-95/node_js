//!  ================== imports starts ==================
const shopController = require("../controllers/shop");
const express = require("express");
const router = express.Router();
const isAuth = require("../middleware/is-auth");
//!  ================== imports end =====================

router.get("/", shopController.getIndex);
router.get("/products", shopController.getProducts);
// single product --> variable segment
// note -> order matters specific route comes before dynamic route
router.get("/products/:productId", shopController.getProduct);

router.get("/cart", isAuth, shopController.getCart);
router.post("/cart", isAuth, shopController.postCart);
router.post("/cart-delete-item", isAuth, shopController.postCartDeleteProduct);

// router.get("/checkout", shopController.getCheckout);
router.post("/create-order", isAuth, shopController.postOrder);
router.get("/orders", isAuth, shopController.getOrders);
// so all authenticated user can see this route
router.get("/orders/:orderId", isAuth, shopController.getInvoice);

module.exports = router;
