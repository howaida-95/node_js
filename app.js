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
// configure session & store
const session = require("express-session");
const MongoDBStore = require("connect-mongodb-session")(session);
//! ------------------------- imports end -------------------------
const MONGODB_URI = "mongodb+srv://howaidasayed95:1751995@firstapi.7v1ba.mongodb.net";
const app = express();
// execute mongodb store as a constructor
const store = new MongoDBStore({
  // connection string
  uri: MONGODB_URI, // in which db server to store the data
  collection: "sessions", // collection where session stored
});
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
    //   maxAge: 3600000, // 1 hour in milliseconds
    //   httpOnly: true, // don't allow client-side javascript to access the cookie
    // }
    store: store,
  })
);

app.use((req, res, next) => {
  if (!req.session.user) {
    return next();
  }
  User.findById(req.session.user._id)
    .then((user) => {
      console.log("user", user);
      req.user = user; // mongoose model user
      next(); // so incoming req come to the next middleware
    })
    .catch((err) => {
      console.log(err);
    });
});

// register routes
app.use("/admin", adminRoutes);
app.use(shopRoutes);
app.use(authRoutes);
app.use(errorController.get404);

mongoose
  .connect(MONGODB_URI)
  .then(() => {
    app.listen(3000);
  })
  .catch((err) => {
    console.log(err);
  });
