// cart & checkout 
const Product = require("../models/product");
const Cart = require("../models/cart");

// get all products
exports.getProducts = (req, res, next) => {
    // fetch products
    Product.fetchAll().then(([rows, fieldData]) => {
        // render when fetchAll is done
        res.render("shop/product-list", { // render the view
            path: "/products",
            pageTitle: "All Products",
            prods: rows,
        }
        );
    }).catch(err => console.log(err));
}

// get single product
exports.getProduct = (req, res, next) => {
    // get id
    // param name productId --> the same used in router
    const prodId = req.params.productId;
    // console.log(req.params, "req.paramsreq.params", prodId);
    Product.findById(prodId).then(([product]) => {
        res.render("shop/product-detail", {
            path: "/products",
            pageTitle: "Product",
            product: product[0],
        }
        );
    }).catch((err) => {
        console.log(err)
    })
}

exports.getIndex = (req, res, next) => {
    // fetch products
    Product.fetchAll().then(([rows, fieldData]) => {
        // render when fetchAll is done
        res.render("shop/index", { // render the view
            path: "/",
            pageTitle: "Shop",
            prods: rows,
        }
        );
    }).catch(err => console.log(err));
}

exports.getCart = (req, res, next) => {
    Cart.getCart(cart => {
        Product.fetchAll(products => {
            const cartProducts = [];
            // filter the products which are in the cart 
            for (product of products) {
                const cartProductData = cart.products.find(prod => prod.id === product.id);
                if (cartProductData) {
                    cartProducts.push({ productData: product, qty: cartProductData.qty })
                }
            }
            res.render("shop/cart", { // render the view
                path: "/cart",
                pageTitle: "Your cart",
                products: cartProducts
            }
            );
        })
    });
}

exports.postCart = (req, res, next) => {
    // get product id from request body 
    const prodId = req.body.productId;
    // fetch product 
    console.log(prodId, "prodIdprodId")
    Product.findById(prodId, (product) => {
        Cart.addProduct(prodId, product.price)
    })
    res.redirect("/cart");
}

exports.postCartDeleteProduct = (req, res, next) => {
    // remove the item from the cart not the products itself
    const prodId = req.body.productId;
    // get the product info first --> so we can get the price
    Product.findById(prodId, (product) => {
        Cart.deleteProduct(prodId, product.price);
        res.redirect("/cart"); // redirection after success of deletion
    })
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

