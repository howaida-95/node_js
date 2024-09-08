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

// get single product
exports.getProduct = (req, res, next) => {
    // get id
    // param name productId --> the same used in router
    const prodId = req.params.productId;
    // console.log(req.params, "req.paramsreq.params", prodId);
    Product.findById(prodId, (product) => {
        res.render("shop/product-detail", {
            path: "/products/:productId",
            pageTitle: "Product",
            prod: product,
        }
        );
    })
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

