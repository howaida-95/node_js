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
    const title = req.body.title;
    const imageUrl = req.body.imageUrl;
    const price = req.body.price;
    const description = req.body.description;
    const product = new Product(title, imageUrl, price, description);
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