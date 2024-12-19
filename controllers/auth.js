exports.getLogin = (req, res, next) => {
  res.render("auth/login", {
    path: "/login",
    pageTitle: "Login",
    isAuthenticated: req.isLoggedIn,
  });
};

exports.postLogin = (req, res, next) => {
  // this data is lost after the request is done
  req.isLoggedIn = true;
  // get login data --> email & password
  // assume the user is logged in & redirect
  res.redirect("/");
};