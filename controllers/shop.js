// cart & checkout 
const Product = require("../models/product");
//const Cart = require("../models/cart");
//const Order = require("../models/order");

// get all products
exports.getProducts = (req, res, next) => {
    // fetch products
    Product.fetchAll().then((product) => {
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
    Product.findById(prodId).then((product) => {
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
    Product.fetchAll().then((product) => {
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
        .then((products) => {
            res.render("shop/cart", {
                path: "/cart",
                pageTitle: "Your cart",
                products: products
            }
            );
        })
        .catch(err => {
            console.log(err)
        });
}

exports.postCart = (req, res, next) => {
    const prodId = req.body.productId;
    Product.findById(prodId).then(product => {
        return req.user.addToCart(product);
    }).then(result => {
        console.log(result, "result")
        res.redirect("/cart");
    }).catch((err) => {
        console.log(err);
    });
}

exports.postCartDeleteProduct = (req, res, next) => {
    // remove the item from the cart not the products itself
    const prodId = req.body.productId;
    req.user.getCart().then((cart) => {
        // find the product with that productId
        return cart.getProducts({ where: { id: prodId } })
    })
        .then((products) => {
            const product = products[0];
            /*
            destroy that product not on the products table
            but in that in-between cart-item
            */
            return product.cartItem.destroy();
        })
        .then((result) => {
            res.redirect("/cart"); // redirection after success of deletion
        })
        .catch((err) => {
            console.log(err);
        })
}

// exports.getOrders = (req, res, next) => {
//     // fetch all the orders & related products
//     // it works because there's a relation between orders & products
//     req.user.getOrders({ include: ["products"] })
//         .then((orders) => {
//             res.render("shop/orders", {
//                 path: "/orders",
//                 pageTitle: "Your orders",
//                 orders: orders
//             }
//             );
//         }).catch((err) => {
//             console.log(err)
//         })
// }

// exports.postOrders = (req, res, next) => {
//     let fetchedCart;
//     req.user.getCart()
//         .then(cart => {
//             // with access to the cart -> we have access to products in the cart
//             fetchedCart = cart;
//             return cart.getProducts();
//         })
//         .then((products) => {
//             // create order associated with a user
//             req.user.createOrder()
//                 .then(order => {
//                     return order.addProducts(products.map((product) => {
//                         /* each product has a special field */
//                         product.orderItem =
//                         {
//                             quantity: product.cartItem.quantity
//                         };
//                         return product;
//                     }));
//                 })
//                 .then(order => {
//                     // drop all cart items
//                     return fetchedCart.setProducts(null)
//                 }).then(() => {
//                     res.redirect("/orders")
//                 })
//                 .catch(err => {
//                     console.log(err)
//                 });
//         })
//         .catch(err => {
//             console.log(err)
//         });
// }

// exports.getCheckout = (req, res, next) => {
//     // render when fetchAll is done
//     res.render("shop/checkout", { // render the view
//         path: "/checkout",
//         pageTitle: "Checkout",
//     }
//     );
// }