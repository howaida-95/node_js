//!  ================== imports starts ================== 
const path = require("path");
const express = require("express");
const bodyParser = require("body-parser");
const adminRoutes = require("./routes/admin");
const shopRoutes = require("./routes/shop");
const errorController = require("./controllers/error");
// the pool which allows us to use a connection in it
const db = require("./util/database");
const sequelize = require("./util/database");

//!  ================== imports end ===================== 

const app = express();
app.set("view engine", "ejs");
app.set("views", "views");

//* -------------- register a parser (before route handling middleware)
app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, "public")));

//* -------------- route handling middleware (the order matters)
app.use("/admin", adminRoutes);
app.use(shopRoutes);

//* -------------- handling not found routers (404 error page)
app.use(errorController.get404);
sequelize.sync().then(result => {
    //console.log(result);
    app.listen(3000);
}).catch(err => {
    console.log(err);
});
/* 
make sure that all models transferred into tables
whenever we start our application
-> sync: used to sync models to database by creating tables & relations
*/