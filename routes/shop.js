//!  ================== imports starts ================== 
const path = require("path");
const rootDir = require("../util/path");
const adminData = require("../routes/admin");
//!  ================== imports end =====================

const express = require("express");
const router = express.Router();

router.get("/", (req, res, next) => {
    console.log(adminData.products, "shop.js");
    const products = adminData.products;
    //res.sendFile(path.join(rootDir, "views", "shop.html"))
    /*
    render method -> it uses default templating engine 
    shop-> shop.pug
    */
    res.render("shop", {
        prods: products,
        docTitle: "Shop",
        path: "/"
    }
    );
});
module.exports = router;

// 2:27