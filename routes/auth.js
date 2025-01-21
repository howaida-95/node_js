// authentication related routes
const authController = require("../controllers/auth");
const express = require("express");

const router = express.Router();

router.get("/login", authController.getLogin);
router.post("/login", authController.postLogin);

router.get("/signup", authController.getSignup);
router.post("/signup", authController.postSignup);

router.get("/reset", authController.getReset);
router.post("/reset", authController.postReset);

router.post("/logout", authController.postLogout);

module.exports = router;
