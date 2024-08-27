//!  ================== imports starts ================== 
const path = require("path");
const express = require("express");
const bodyParser = require("body-parser");
const adminData = require("./routes/admin");
const shopRoutes = require("./routes/shop");
const expressHbs = require("express-handlebars");
//!  ================== imports end ===================== 

const app = express();
/* tell express about handlebars engine to use
so we use engine method -> register a templating engine
in case non built-in engines
views extended main-layout automatically as it's the default layout

note
----
extension name by default handlebars --> we can change that by using extname
*/
console.log(expressHbs);
app.engine("handlebars", expressHbs.engine({ defaultLayout: 'main-layout' })); // engine name -> template engine func to initialize it

// set a global config value 
app.set("view engine", "handlebars");

//app.set("view engine", "pug");
// tell express where to find views
app.set("views", "views");

//* -------------- register a parser (before route handling middleware)
app.use(bodyParser.urlencoded({ extended: false }));
/* built-in middleware to serve static files 
path to the folder that served statically
*/
app.use(express.static(path.join(__dirname, "public")))
//* -------------- route handling middleware (the order matters)
//app.use("/admin", adminRoutes);
app.use("/admin", adminData.routes);
app.use(shopRoutes);

//* -------------- handling not found routers (404 error page)
// catch all middleware 
app.use((req, res, next) => {
    //res.status(404).sendFile(path.join(__dirname, "views", "404.html"));
    res.status(404).render("404", {
        pageTitle: "page not found"
    })
})
app.listen(3000);