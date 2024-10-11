// cart & checkout 
const Product = require("../models/product");
const Cart = require("../models/cart");

// get all products
exports.getProducts = (req, res, next) => {
    // fetch products
    Product.findAll().then((product) => {
        res.render("shop/product-list", { // render the view
            path: "/products",
            pageTitle: "All Products",
            prods: product,
        }
        );
    }).catch((err) => {
        console.log(err)
    });
}

// get single product
exports.getProduct = (req, res, next) => {
    // get id
    // param name productId --> the same used in router
    const prodId = req.params.productId;
    // console.log(req.params, "req.paramsreq.params", prodId);
    Product.findByPk(prodId).then((product) => {
        res.render("shop/product-detail", {
            path: "/products",
            pageTitle: "Product",
            product: product,
        }
        );
    }).catch((err) => {
        console.log(err);
    })

    /*
        other way to do that by using 
        findAll & where syntax
        Product.findAll({where: {id: prodId}}).then(product=> {
            res.render("shop/product-detail", {
            path: "/products",
            pageTitle: "Product",
            product: product[0],
                }
            })
        .catch(err => console,log(err))
    */
}

exports.getIndex = (req, res, next) => {
    /*
    ==> fetch products
    findAll --> have where condition we can restrict the data we retrieve
    */
    Product.findAll().then((product) => {
        res.render("shop/index", { // render the view
            path: "/",
            pageTitle: "Shop",
            prods: product,
        }
        );
    }).catch((err) => {
        console.log(err)
    });
}

exports.getCart = (req, res, next) => {
    req.user.getCart()
        .then((cart) => {
            return cart.getProducts()
                .then((products) => {
                    res.render("shop/cart", { // render the view
                        path: "/cart",
                        pageTitle: "Your cart",
                        products: products
                    }
                    );
                })
                .catch(err => {
                    console.log(err)
                });
        })
        .catch((err) => {
            console.log(err);
        })
}

exports.postCart = (req, res, next) => {
    const prodId = req.body.productId;
    let fetchedCart;
    req.user.getCart()
        .then((cart) => {
            // check if the product is already part of the cart
            // true -> increase the quantity | false -> add one
            fetchedCart = cart;
            return cart.getProducts({ where: { id: prodId } });
        })
        .then(products => {
            let product;
            if (products.length > 0) {
                product = products[0];
            }
            let newQuantity = 1;
            if (product) {
                // get old quantity of this product & change it
            }
            return Product.findByPk(prodId)
                .then((product) => {
                    return fetchedCart.addProduct(product, { through: { quantity: newQuantity } });
                }).then(() => {
                    res.redirect("/cart");
                })
                .catch((err) => { console.log(err) });
        })
        .catch((err) => {
            console.log(err);
        })
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
