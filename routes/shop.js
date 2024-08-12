//!========== these are the routes that are reached by admin
const path = require("path");
const rootDir = require("../util/path");
/*
it's like a mini express app tied to other express app 
*/
const express = require("express");
const router = express.Router();

router.get("/", (req, res, next) => {
    /*res.send("<h1>hello from express</h1>")
    path -> "/views/shop.html" (incorrect)
    absolute path is correct but 
    "/" -> refers to the root folder on our operating system
    so we use path --> concatenate different segments
    __dirname --> holds absolute path on the operating system
    it builds the path for linux(ex: /views/shop.html) & 
    for windows(ex: "\views\shop.html")
    ---------------
    __dirname -> refers to routes folder
    views -> is a sibling folder so we use "../"
    */
    res.sendFile(path.join(rootDir, "views", "shop.html"))
});

module.exports = router;