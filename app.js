//!  ================== imports starts ================== 
const path = require("path");
const express = require("express");
const bodyParser = require("body-parser");
const adminRoutes = require("./routes/admin");
const shopRoutes = require("./routes/shop");
const errorController = require("./controllers/error");
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
// catch all middleware 
app.use(errorController.get404);
app.listen(3000);