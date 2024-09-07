const Product = require("../models/product");

// this is what we do --> get add product page 
exports.getAddProduct = (req, res, next) => {
    res.render("admin/add-product", {// render view 
        path: "admin/add-product",
        pageTitle: "add product",
    });
}

// adding a new product 
exports.postAddProduct = (req, res, next) => {
    // create an object based on the class blueprint
    const product = new Product(req.body.title);
    // save the product 
    product.save();
    res.redirect("/");
}

// adding a new product 
exports.getProducts = (req, res, next) => {
    Product.fetchAll(products => {
        res.render("admin/products", {// render view 
            path: "admin/add-product",
            pageTitle: "Admin products",
            prod: products
        });

    })
}
