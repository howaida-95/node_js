exports.getLogin = (req, res, next) => {
  const isLoggedIn = req.get("cookie")?.split("=")[1]; // cookie: loggedIn=true
  res.render("auth/login", {
    path: "/login",
    pageTitle: "Login",
    isAuthenticated: isLoggedIn,
  });
  //console.log(req.get("cookie").split("=")[1], "cookie");
};

exports.postLogin = (req, res, next) => {
  // this data is lost after the request is done
  //req.isLoggedIn = true;
  // get login data --> email & password
  // assume the user is logged in & redirect
  /*
    "Set-Cookie" --> reserved name for cookies
    "loggedIn=true" --> value for set-cookie ==> key=value
  */
  res.setHeader("Set-Cookie", "loggedIn=true");
  res.redirect("/");
};

/*
don't store in req--> because after the request is done, the data is lost
alternatives 
------------
- global variable stored in external file (not recommended)
because it will be shared across all requests & users
if the server is restarted, the data will be lost.

- store in cookies (recommended)
and it will be stored in the browser for every single user
store in the browser & send it with every request to the server 
cookies can be set to expire after a certain time
--> expire (session) --> expired when the browser is closed

- store in session (recommended)
- store in database (recommended)
- store in localstorage (not recommended)
*/
