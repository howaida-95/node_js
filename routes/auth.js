// authentication related routes
const authController = require("../controllers/auth");
const express = require("express");
const router = express.Router();
const { check } = require("express-validator");

router.get("/login", authController.getLogin);
router.post("/login", authController.postLogin);

router.get("/signup", authController.getSignup);

/* adding validation to the route , path + any numbers of middlewares
check(field name)
*/
router.post(
  "/signup", // path
  // express validator middleware --> this middleware stores errors it found in error object
  check("email").isEmail().withMessage("Please enter a valid email"),
  authController.postSignup // controller
);

router.get("/reset", authController.getReset);
router.post("/reset", authController.postReset);

router.get("/reset/:token", authController.getNewPassword);
router.post("/new-password", authController.postNewPassword);

router.post("/logout", authController.postLogout);

module.exports = router;
