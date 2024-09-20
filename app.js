//!  ================== imports starts ================== 
const path = require("path");
const express = require("express");
const bodyParser = require("body-parser");
const adminRoutes = require("./routes/admin");
const shopRoutes = require("./routes/shop");
const errorController = require("./controllers/error");
// the pool which allows us to use a connection in it
const db = require("./util/database");
//!  ================== imports end ===================== 

const app = express();
app.set("view engine", "ejs");
app.set("views", "views");

//* -------------- register a parser (before route handling middleware)
app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, "public")));
// SELECT * FROM products
// db.execute("SELECT * FROM products").then((res) => {
//     console.log(res[0]);
// }).catch((err) => {
//     console.log(err)
// });
// end it whenever it's shutdown
//db.end();
//* -------------- route handling middleware (the order matters)
app.use("/admin", adminRoutes);
app.use(shopRoutes);

//* -------------- handling not found routers (404 error page)
// catch all middleware 
app.use(errorController.get404);
app.listen(3000);