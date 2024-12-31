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
  User.findById("67578b1a9c80c41631592acb")
    .then((user) => {
      // session added to req object by the session middleware
      req.session.isLoggedIn = true; // add a new property to the session object (saved across request but not users)
      req.user = user;
      /*
      when response the session middleware goes ahead & create that session
      and that means it writes it to mongodb
      because we use mongodb session store 
      redirect is fired independent from that though so redirection might fired early
      ==> to make sure that session had been set then redirect
      */
      req.session.save((err) => {
        console.log(err);
        res.redirect("/");
      });
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
