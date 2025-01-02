const User = require("../models/user");
const bcrypt = require("bcryptjs");

exports.getLogin = (req, res, next) => {
  console.log(req.session.isLoggedIn, "session");
  res.render("auth/login", {
    path: "/login",
    pageTitle: "Login",
    isAuthenticated: req.session.isLoggedIn,
  });
  //console.log(req.get("cookie").split("=")[1], "cookie");
};

exports.postLogin = (req, res, next) => {
  /* 
  functionality to ensure that we can sign in
  - extract information from request
  - validate the req body data ==> email, password
  - find the user with that email ==> if no user found ==> return error
  - compare the password
  - redirect to home page
  - set the session
  */

  // extract data from request
  const email = req.body.email;
  const password = req.body.password;

  // find the user with that email
  User.findOne({ email: email })
    .then((user) => {
      if (!user) {
        return res.redirect("/login");
      } else {
        // if user found ==> check the password
        // bcrypt
        bcrypt.compare(password, user.password).then((doMatch) => {
          if (doMatch) {
            req.session.isLoggedIn = true;
            req.session.user = user;
            return req.session.save((err) => {
              console.log(err);
              res.redirect("/");
            });
          }
          res.redirect("/login");
        });
      }
    })
    .catch((err) => {
      console.log(err);
    });
};

/*
steps:
- extract information from request 
- validate the req body data --> email, password & confirmPassword
- check if the user with that email already exist 
because there is no duplicate email in db 
how ??
------
=> create index in mongodb  
=> find user with that email 
- create a new user 
*/

exports.postSignup = (req, res, next) => {
  // extract information from request
  const email = req.body.email;
  const password = req.body.password;
  const confirmPassword = req.body.confirmPassword;

  //  check if the user with that email already exist
  User.findOne({ email: email })
    .then((userDoc) => {
      if (userDoc) {
        return res.redirect("/signup");
      }
      /* hashed password
      hash method takes:
      - password to be hashed
      - saltRounds (number of rounds to hash the password)
        the higher the value the longer it will take but the more secure it will be
      */
      return bcrypt
        .hash(password, 12)
        .then((hashedPassword) => {
          // create a new user
          const user = new User({
            email: email,
            password: hashedPassword,
            cart: { items: [] },
          });
          return user.save();
        })
        .then((result) => {
          res.redirect("/login");
        });
    })
    .catch((err) => {
      console.log(err);
    });
};

exports.getSignup = (req, res, next) => {
  res.render("auth/signup", {
    path: "/signup",
    pageTitle: "Signup",
    isAuthenticated: false,
  });
};

exports.postLogout = (req, res, next) => {
  req.session.destroy((err) => {
    console.log(err);
    // function called once session is destroyed
    res.redirect("/");
  });
};

/*
  session needs cookie to store the session id
  to identify the user
  but the sensitive data is stored on the server
  we can't modify it from the client side
  --------------------------------------------
  we can store other data in sessions like: cart 
*/
