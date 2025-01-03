// middleware function to check if the user is authenticated
module.exports = (req, res, next) => {
  if (!req.session.isLoggedIn) {
    return res.redirect("/login");
  }
  // otherwise allow the request to continue to whichever route is next
  next();
};
