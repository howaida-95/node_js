// authentication related routes
const authController = require("../controllers/auth");
const express = require("express");

const router = express.Router();

router.get("/login", authController.getLogin);

module.exports = router;
