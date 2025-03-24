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
const csrf = require("csurf");
const flash = require("connect-flash"); // register or initialized after the session
const multer = require("multer");

const shopController = require("./controllers/shop");
const isAuth = require("./middleware/is-auth");

//! ------------------------- imports end -------------------------
const MONGODB_URI = "mongodb+srv://howaidasayed95:1751995@firstapi.7v1ba.mongodb.net";
const app = express();

// execute mongodb store as a constructor
const store = new MongoDBStore({
  // connection string
  uri: MONGODB_URI, // in which db server to store the data
  collection: "sessions", // collection where session stored
});

/* 
  initialize csrf protection
  csrfProtection is a middleware function that will be executed for every incoming request
  it will check if the incoming request has a valid csrf token
  if it is valid then the request will be processed
  otherwise, it will throw an error
  csrf({ cookie: true }) --> it will send a cookie with the csrf token
  store the secret that will be used to sign the csrf token in the session(by default) or in the cookie
*/

const csrfProtection = csrf(); // used after session middleware because it uses session
//^ multer
// diskStorage: is a storage engine which we can use multer
const fileStorage = multer.diskStorage({
  destination: (req, file, cb) => {
    // if error nullable tell multer to store it
    // cb(err, storage place)
    cb(null, "images");
  },

  /*
2 images with the same name doesn't override each other 
*/
  filename: (req, file, cb) => {
    cb(null, `${Date.now()}-${file.originalname}`);
  },
});

const fileFilter = (req, file, cb) => {
  if (file.mimetype === "image/png" || file.mimetype === "image/jpg" || file.mimetype === "image/jpeg") {
    cb(null, true); // accept that file
  } else {
    cb(null, false); // reject that file
  }
};

app.set("view engine", "ejs");
app.set("views", "views");
/*
  encoded in text when submitted --> urlencoded
  bodyParser --> can't handle file data
  file is binary data --> multipart/form-data
  multer --> middleware for each request 
  single("image") --> image (the name of input file)
*/
app.use(bodyParser.urlencoded({ extended: false }));
// initialize multer
app.use(
  multer({
    storage: fileStorage,
    fileFilter: fileFilter,
  }).single("image")
);

/* 
statically serving a folder 
the req to files in that folder will be handled automatically & the files will be returned
==> files served as they are in the root folder like /... not images/ or public/
*/
app.use(express.static(path.join(__dirname, "public")));
// if there's a req starts with /images
app.use("/images", express.static(path.join(__dirname, "images")));

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

// we can use flash middleware across the application
app.use(flash());

/******************************************/
/*
isAuthenticated: req.session.isLoggedIn,
csrfToken: req.csrfToken(),
tell express that we have data that should be included with every request 
should be before all the routes
-> it allows to set local variables that are passed into the views 
local because they only exist in the views which are rendered 
with every request executed, these 2 fields will be available in the views
*/
app.use((req, res, next) => {
  res.locals.isAuthenticated = req.session.isLoggedIn;
  next();
});

/***************************************** */

app.use((req, res, next) => {
  if (!req.session.user) {
    return next();
  }
  User.findById(req.session.user._id)
    .then((user) => {
      if (!user) {
        next();
      }
      req.user = user; // mongoose model user
      next(); // so incoming req come to the next middleware
    })
    .catch((err) => {
      //throw new Error(err); not doing anything, not lead to express error handling
      next(new Error(err));
    });
});


app.post("/create-order", isAuth, shopController.postOrder);
app.use(csrfProtection);
/*
in any non get request --> invalid csrf token
as data is changed via post request , so we need to handle it via post request
so this package will look for the existence of a csrf token in the views 

steps:
- pass csrf token in the views
- req.csrfToken() --> method provided by the csrf middleware which added by this package 
so it will generate a csrf token and pass it to the views
*/
app.use((req, res, next) => {
  res.locals.csrfToken = req.csrfToken();
  next();
});

// register routes
app.use("/admin", adminRoutes);
app.use(shopRoutes);
app.use(authRoutes);

app.get("/500", errorController.get500);
// for every middleware not handled ahead of time , it will be handled by this middleware
// not a technical error object
app.use(errorController.get404);

// express ERROR handling middleware (contain 4 args)
// reached when we call next(err)
app.use((error, req, res, next) => {
  //res.status(error.httpStatusCode).render();
  //res.render("500");
  //res.redirect("/500");
  res.status(500).render("500", {
    path: "/500",
    pageTitle: "Error!",
  });
});

mongoose
  .connect(MONGODB_URI)
  .then(() => {
    app.listen(3000);
  })
  .catch((err) => {
    console.log(err);
  });

/*
  in synchronous code --> throw the error 
  in async code --> use next(err)
  ---------------------------------------
  error code -> extra information send to the browser so it understands if an operation succeeded or not
  if an error happened and which kind  of error 
  map certain types of error ---> to certain  kind of status code

  - 2 hundred status code (success status code)
  most important --> 200 & 201 
    200 (operation succeeded)
    201 (success and resource created)

  - 3 hundreds status code (redirection)
    301 (permanent redirect)

  - 4 hundreds status code (client error)
    error happened because something happened by the client 
    ex: 
    incorrect data was entered into a form --> 420
    401 --> not authenticated
    403 --> not authorized
    404 --> not found
    405 --> method not allowed
    406 --> not acceptable
    410 --> gone
    422 -> invalid input

  - 5 hundreds status code (server error)
    indicates server side error occurred 
    500 --> internal server error
    
*/
