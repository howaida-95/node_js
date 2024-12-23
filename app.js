//! ------------------------- imports start --------------------
const adminRoutes = require("./routes/admin");
const shopRoutes = require("./routes/shop");
const authRoutes = require("./routes/auth");

const path = require("path");
const express = require("express");
const bodyParser = require("body-parser");

const errorController = require("./controllers/error");
const User = require("./models/user");
const mongoose = require("mongoose");
const session = require("express-session");
//! ------------------------- imports end -------------------------
const app = express();

app.set("view engine", "ejs");
app.set("views", "views");

app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, "public")));
/* 
initialize the session middleware when the server starts
then session will be used for every incoming request 
*/
app.use(
  session({
    // configure the session
    secret: "my secret", // used to sign the session id cookie (signing the hash)--> should be a long string
    resave: false, // don't save the session if nothing changed, not be saved on every request for performance
    saveUninitialized: false, // don't save empty value in the session store
    // cookie: {
    //   // configure the cookie
    //   maxAge: 3600000, // 1 hour in milliseconds
    //   httpOnly: true, // don't allow client-side javascript to access the cookie
    // }
  })
);

app.use((req, res, next) => {
  User.findById("67578b1a9c80c41631592acb")
    .then((user) => {
      req.user = user;
      next();
    })
    .catch((error) => {});
});

// register routes
app.use("/admin", adminRoutes);
app.use(shopRoutes);
app.use(authRoutes);

app.use(errorController.get404);

mongoose
  .connect("mongodb+srv://howaidasayed95:1751995@firstapi.7v1ba.mongodb.net")
  .then(() => {
    // findOne with no arg --> give the first found item
    User.findOne().then((user) => {
      if (!user) {
        // create user before start listening
        const user = new User({
          name: "Howaida Sayed",
          email: "howaidasayed95@gmail.com",
          cart: { items: [] },
        });
        return user.save();
      }
    });
    app.listen(3000);
  })
  .catch((err) => {
    console.log(err);
  });
