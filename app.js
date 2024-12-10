//! ------------------------- imports start --------------------
const adminRoutes = require("./routes/admin");
const shopRoutes = require("./routes/shop");

const path = require('path');
const express = require('express');
const bodyParser = require('body-parser');

const errorController = require('./controllers/error');
const User = require("./models/user");
const mongoose = require("mongoose");
//! ------------------------- imports end -------------------------
const app = express();

app.set('view engine', 'ejs');
app.set('views', 'views');

app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, 'public')));

app.use((req, res, next) => {
    User.findById("67578b1a9c80c41631592acb").then((user) => {
        /*
        user stored here is just an obj with properties (the data we have in a database)
        not the methods 
        because it's a data getting out of db & and the methods aren't stored there
        req.user = user;
        */

        // getting real user --> username, email, cart, id
        // now we can call User methods on it
        req.user = user;
        next();
    }).catch((error) => {
        console.log(error)
    })
})

app.use("/admin", adminRoutes);

app.use(shopRoutes);

app.use(errorController.get404);

mongoose.connect("mongodb+srv://howaidasayed95:1751995@firstapi.7v1ba.mongodb.net")
    .then(() => {
        // findOne with no arg --> give the first found item
        User.findOne().then((user) => {
            if (!user) {
                // create user before start listening 
                const user = new User({
                    name: 'Howaida Sayed',
                    email: 'howaidasayed95@gmail.com',
                    cart: { items: [] }
                });
                return user.save();
            }
        })
        app.listen(3000)
    }).catch((err) => {
        console.log(err);
    })