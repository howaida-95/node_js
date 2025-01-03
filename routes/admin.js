// //!========== imports start ===================
// const path = require("path");
// const bodyParser = require("body-parser");
// const express = require("express");
// const adminController = require("../controllers/admin");
// const router = express.Router();
// //!========== imports end =====================
// // router.get("/products", adminController.getProducts);
// // admin/add-product ==> GET
// router.get("/add-product", adminController.getAddProduct);
// // admin/add-product ==> POST
// router.post("/add-product", adminController.postAddProduct);

// // router.get("/edit-product/:productId", adminController.getEditProduct)
// // no dynamic segment because it's gonna be sent to
// // router.post("/edit-product", adminController.postEditProduct);

// // router.post("/delete-product", adminController.postDeleteProduct);
// module.exports = router;

const path = require("path");

const express = require("express");

const adminController = require("../controllers/admin");

const router = express.Router();

const isAuth = require("../middleware/is-auth");
// /admin/add-product => GET
router.get(
  "/add-product", // route path
  isAuth, // middleware function to check if the user is authenticated
  adminController.getAddProduct // controller function to render the page
);
// /admin/add-product => POST
router.post("/add-product", isAuth, adminController.postAddProduct);

// // /admin/products => GET
router.get("/products", isAuth, adminController.getProducts);

router.get("/edit-product/:productId", isAuth, adminController.getEditProduct);
router.post("/edit-product", isAuth, adminController.postEditProduct);

router.post("/delete-product", isAuth, adminController.postDeleteProduct);

module.exports = router;