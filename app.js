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
const Product = require("./models/product");
const User = require("./models/user");
const Cart = require("./models/cart");
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

// for incoming request, we will execute this function
app.use((req, res, next) => {
    User.findByPk(1).then((user) => {
        // store sequelized  user that is retrieved from database in req
        req.user = user;
        next();
    }).catch((err) => {
        console.log(err);
    });
})
//* -------------- handling not found routers (404 error page)
app.use(errorController.get404);

//1.define models before syncing data to database
Product.belongsTo(User, {
    // here we define how this relationship is managed
    constraints: true,
    // if user is deleted what happens to any connected product
    /* 
        cascade -> means deletion will be executed to product too
        if we delete the user -> we delete any price related to the user too
    */
    onDelete: "CASCADE",
});
// -> apply the inverse -> one user can have many products
User.hasMany(Product);

// 2.sync  data to db
// sequelize.sync({ force: true })
sequelize.sync()
    .then(result => {
        // once the product is created 
        app.listen(3000);
        return User.findByPk(1);
        //console.log(result);
    })
    .then((user) => {
        if (!user) {
            return User.create({ name: "Howaida", email: "howaida@gmail.com" });
        }
        return user;
    })
    .catch(err => {
        console.log(err);
    });

/* 
make sure that all models transferred into tables
whenever we start our application
-> sync: used to sync models to database by creating tables & relations
*/