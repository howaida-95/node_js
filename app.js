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
const CartItem = require("./models/cart-item");
const Order = require("./models/order");
const OrderItem = require("./models/order-item");
//!  ================== imports end ===================== 

const app = express();
app.set("view engine", "ejs");
app.set("views", "views");

//* -------------- register a parser (before route handling middleware)
app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, "public")));

//* -------------- route handling middleware (the order matters)
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

app.use("/admin", adminRoutes);
app.use(shopRoutes);

//* -------------- handling not found routers (404 error page)
app.use(errorController.get404);

//* ------------------------------------- start product model ----------------------------
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
//* ------------------------------------- end product model ----------------------------

//& hasOne (one-to-one relationships) ------------> source model => target model (has pk)
//& belongsTo (one-to-one relationships) -----------> source model(has pk) => target model
//& hasMany (one-to-many relationships) ------------> source model => target model (has pk)
//& belongsToMany (many-to-many relationships) --------> injunction table contain extra data & pk for both

//* ------------------------------------- start cart model ----------------------------
//^ --> cart & user
User.hasOne(Cart);
// inverse of hasOne relation (optional, can be ignored)
Cart.belongsTo(User);
// because one cart can hold multiple products
// and single product can be part of multiple carts
// through -> to tell sequelize which model to use as in between model
// This relationship requires an intermediary (junction) table to handle the connection between the two models. -->  have two foreign keys:
//^ --> cart & product
Cart.belongsToMany(Product, { through: CartItem });
Product.belongsToMany(Cart, { through: CartItem });
//* ------------------------------------- end cart model ----------------------------


//* ------------------------------------- start order model ----------------------------
//^ --> order & user
// many to one
Order.belongsTo(User);
// one to many -> order table (target model) has userId reference the User who owns it ( foreign key )
User.hasMany(Order);

//^ --> order & products
Order.belongsToMany(Product, { through: OrderItem });
Product.belongsToMany(Order, { through: OrderItem });
//* ------------------------------------- end order model ----------------------------

// 2.sync  data to db
sequelize.sync()
    //sequelize.sync({ force: true })
    .then(() => {
        return User.findByPk(1);  // Find user or create if it doesn't exist
    })
    .then((user) => {
        if (!user) {
            return User.create({ name: "Howaida", email: "howaidasayed95@gmail.com" });
        }
        return user;
    })
    .then(user => {
        return user.createCart();
        //console.log(result);
    })
    .then((cart) => {
        // once the cart is created 
        app.listen(3000);
    })
    .catch(err => {
        console.log(err);
    });
/*
make sure that all models transferred into tables
whenever we start our application
-> sync: used to sync models to database by creating tables & relations
*/