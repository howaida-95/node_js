//! ------------------------- imports start --------------------
const adminRoutes = require("./routes/admin");
const shopRoutes = require("./routes/shop");

const path = require('path');
const express = require('express');
const bodyParser = require('body-parser');

const errorController = require('./controllers/error');
const { mongoConnect } = require('./util/database');
const User = require("./models/user");
const mongodb = require("mongodb");
//! ------------------------- imports end ----------------------

const app = express();

app.set('view engine', 'ejs');
app.set('views', 'views');

app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, 'public')));

app.use((req, res, next) => {
    User.findById("672bc53bc6b8af3f69a99736").then((user) => {
        /*
        user stored here is just an obj with properties (the data we have in a database)
        not the methods 
        because it's a data getting out of db & and the methods aren't stored there
        req.user = user;
        */

        // getting real user --> username, email, cart, id
        // now we can call User methods on it
        req.user = new User(user.name, user.email, user.cart, user._id)
        next();
    }).catch((error) => {
        console.log(error)
    })
})

app.use("/admin", adminRoutes);

app.use(shopRoutes);

app.use(errorController.get404);

mongoConnect(() => {
    /*
    when connecting check if a user with a specific id exists
    if not fount create a user 
    */
    app.listen(3000);
});