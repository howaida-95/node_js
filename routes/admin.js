//!========== these are the routes that are reached by admin
const path = require("path");
const rootDir = require("../util/path");
/*
it's like a mini express app tied to other express app 
*/
const bodyParser = require("body-parser");
const express = require("express");
const router = express.Router();
/* router can used as the following:-
    router.use
    router.post
    router.get
*/

// admin/add-product ==> GET
router.get("/add-product", (req, res, next) => {
    console.log("in another middleware");
    //res.send('<form action="/admin/add-product" method="POST"><input type="text" name="title"><button type="submit">Add Product</button></form>');
    //res.sendFile(path.join(__dirname, "..", "views", "add-product.html"));
    res.sendFile(path.join(rootDir, "views", "add-product.html"));

});

// admin/add-product ==> POST
router.post("/add-product", (req, res, next) => {
    console.log(req.body, "req.body");
    res.redirect("/");
});

module.exports = router;
/*
note
=====
router.use() ==> for all requests
*/