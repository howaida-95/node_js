//!  ================== imports starts ================== 
const path = require("path");
const express = require("express");
const bodyParser = require("body-parser");
const adminRoutes = require("./routes/admin");
const shopRoutes = require("./routes/shop");
//!  ================== imports end ===================== 

const app = express();

//* -------------- register a parser (before route handling middleware)
app.use(bodyParser.urlencoded({ extended: false }));
/* built-in middleware to serve static files 
path to the folder that served statically
*/
app.use(express.static(path.join(__dirname, "public")))
//* -------------- route handling middleware (the order matters)
// now only routes start with /admin -> will go into admin routes file 
// express will ignore /admin when match these routes
app.use("/admin", adminRoutes);
app.use(shopRoutes);

//* -------------- handling not found routers (404 error page)
// catch all middleware 
app.use((req, res, next) => {
    res.status(404).sendFile(path.join(__dirname, "views", "404.html"));
})
app.listen(3000);