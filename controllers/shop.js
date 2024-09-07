// cart & checkout 
const Product = require("../models/product");

// get all products
exports.getProducts = (req, res, next) => {
    // fetch products
    Product.fetchAll((products) => {
        // render when fetchAll is done
        res.render("shop/product-list", { // render the view
            path: "/products",
            pageTitle: "All Products",
            prods: products,
        }
        );
    });
}

exports.getIndex = (req, res, next) => {
    // fetch products
    Product.fetchAll((products) => {
        // render when fetchAll is done
        res.render("shop/index", { // render the view
            path: "/",
            pageTitle: "Shop",
            prods: products,
        }
        );
    });
}

exports.getCart = (req, res, next) => {
    res.render("shop/cart", { // render the view
        path: "/cart",
        pageTitle: "Your cart",
    }
    );
}

exports.getOrders = (req, res, next) => {
    res.render("shop/orders", { // render the view
        path: "/orders",
        pageTitle: "Your orders",
    }
    );

}

exports.getCheckout = (req, res, next) => {
    // render when fetchAll is done
    res.render("shop/checkout", { // render the view
        path: "/checkout",
        pageTitle: "Checkout",
    }
    );
}