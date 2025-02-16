// authentication related routes
const authController = require("../controllers/auth");
const express = require("express");
const router = express.Router();
const { check, body } = require("express-validator");
const User = require("../models/user");

router.get("/login", authController.getLogin);
router.post(
  "/login",
  [
    check("email")
      .isEmail()
      .withMessage("Please enter a valid email")
      .custom((value, { req }) => {
        return User.findOne({ email: value }).then((userDoc) => {
          if (userDoc) {
            return Promise.reject("invalid email");
          }
        });
      }),
    body("password", "Please Enter a password with only numbers and text at least 5 character")
      .isLength({ min: 5 })
      .isAlphanumeric(),
    body("confirmPassword").custom((value, { req }) => {
      if (value !== req.body.confirmPassword) {
        throw new Error("Passwords have to match");
      }
      return true;
    }),
  ],
  authController.postLogin
);
router.get("/signup", authController.getSignup);

/* 
adding validation to the route , path + any numbers of middlewares
check(field name)
*/
router.post(
  "/signup", // path
  // express validator middleware --> this middleware stores errors it found in error object
  [
    check("email")
      .isEmail()
      .withMessage("Please enter a valid email")
      // using custom validation here to check if email is already in use (check specific email)
      .custom((value, { req }) => {
        // throw new Error("this email address is forbidden");
        return User.findOne({ email: value }).then((userDoc) => {
          if (userDoc) {
            // throw an error inside the promise
            return Promise.reject("E-mail already exist, please pick a different one.");
          }
        });
      }),
    /* 
    without using message it will use the default message
    we can use withMessage with after every validator
    we use default message for all validators
    */
    body("password", "Please Enter a password with only numbers and text at least 5 character")
      .isLength({ min: 5 })
      //.withMessage("Please Enter a password with only numbers and text at least 5 character")
      .isAlphanumeric(),
    //.withMessage("Please Enter a password with only numbers and text at least 5 character"),

    body("confirmPassword").custom((value, { req }) => {
      /* we exported req obj to extract password
        note 
        ----
        we don't repeat the same validation of password with confirmPassword 
        because we are checking the equality here 
      */
      if (value !== req.body.confirmPassword) {
        throw new Error("Passwords have to match");
      }
      return true;
    }),
  ],

  authController.postSignup // controller
);

router.get("/reset", authController.getReset);
router.post("/reset", authController.postReset);

router.get("/reset/:token", authController.getNewPassword);
router.post("/new-password", authController.postNewPassword);

router.post("/logout", authController.postLogout);
module.exports = router;
