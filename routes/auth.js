// authentication related routes
const authController = require("../controllers/auth");
const express = require("express");
const router = express.Router();
const { check } = require("express-validator");

router.get("/login", authController.getLogin);
router.post("/login", authController.postLogin);
router.get("/signup", authController.getSignup);

/* 
adding validation to the route , path + any numbers of middlewares
check(field name)
*/
router.post(
  "/signup", // path
  // express validator middleware --> this middleware stores errors it found in error object
  check("email")
    .isEmail()
    .withMessage("Please enter a valid email")
    // using custom validation here to check if email is already in use (check specific email)
    .custom((value, { req }) => {
      // throw an error when validation fails
      if (value === "test@test.com") {
        // we can throw error or test@test.com
        throw new Error("this email address is forbidden");
      }
      return true;
    }),
  authController.postSignup // controller
);

router.get("/reset", authController.getReset);
router.post("/reset", authController.postReset);

router.get("/reset/:token", authController.getNewPassword);
router.post("/new-password", authController.postNewPassword);

router.post("/logout", authController.postLogout);

module.exports = router;
