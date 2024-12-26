const User = require("../models/user");

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
      res.redirect("/");
    })
    .catch((err) => {
      console.log(err);
    });
};

exports.postLogout = (req, res, next) => {
  req.session.destroy((err) => {
    console.log(err);
    // function called once session s destroyed
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
