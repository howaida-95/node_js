// cart & checkout
const Product = require("../models/product");
const Order = require("../models/order");

// get all products
exports.getProducts = (req, res, next) => {
  // fetch products
  Product.find()
    .then((product) => {
      res.render("shop/product-list", {
        // render the view
        path: "/products",
        pageTitle: "All Products",
        prods: product,
        isAuthenticated: req.session.isLoggedIn,
      });
    })
    .catch((err) => {
      console.log(err);
    });
};
// get single product
exports.getProduct = (req, res, next) => {
  const prodId = req.params.productId;
  Product.findById(prodId)
    .then((product) => {
      res.render("shop/product-detail", {
        path: "/products",
        pageTitle: "Product",
        product: product,
        isAuthenticated: req.session.isLoggedIn,
      });
    })
    .catch((err) => {
      console.log(err);
    });
};

exports.getIndex = (req, res, next) => {
  Product.find()
    .then((product) => {
      res.render("shop/index", {
        // render the view
        path: "/",
        pageTitle: "Shop",
        prods: product,
        isAuthenticated: req.session.isLoggedIn,
      });
    })
    .catch((err) => {
      console.log(err);
    });
};

exports.getCart = async (req, res, next) => {
  try {
    const user = await req.user.populate("cart.items.productId");
    res.render("shop/cart", {
      path: "/cart",
      pageTitle: "Your cart",
      products: user.cart.items,
      isAuthenticated: req.session.isLoggedIn,
    });
  } catch (err) {
    console.log(err);
    next(err);
  }
};

exports.postCart = (req, res, next) => {
  const prodId = req.body.productId;
  Product.findById(prodId)
    .then((product) => {
      return req.user.addToCart(product);
    })
    .then((result) => {
      console.log(result, "result");
      res.redirect("/cart");
    })
    .catch((err) => {
      console.log(err);
    });
};

exports.postCartDeleteProduct = (req, res, next) => {
  const prodId = req.body.productId;
  req.user
    .deleteItemFromCart(prodId)
    .then((result) => {
      res.redirect("/cart");
    })
    .catch((err) => {
      console.log(err);
    });
};

exports.getOrders = (req, res, next) => {
  Order.find({ "user.userId": req.user._id })
    .then((orders) => {
      res.render("shop/orders", {
        path: "/orders",
        pageTitle: "Your orders",
        orders: orders,
        isAuthenticated: req.session.isLoggedIn,
      });
    })
    .catch((err) => {
      console.log(err);
    });
};

exports.postOrder = (req, res, next) => {
  req.user
    .populate("cart.items.productId")
    .then((user) => {
      const products = user.cart.items.map((i) => {
        return {
          quantity: i.quantity,
          product: { ...i.productId._doc },
        };
      });
      // initialize order
      const order = new Order({
        products: products,
        user: {
          name: req.user.name,
          userId: req.user,
        },
      });
      return order.save();
    })
    .then((result) => {
      return req.user.clearCart();
    })
    .then((result) => {
      res.redirect("/orders");
    })
    .catch((err) => console.log(err));
};

// exports.getCheckout = (req, res, next) => {
//     // render when fetchAll is done
//     res.render("shop/checkout", { // render the view
//         path: "/checkout",
//         pageTitle: "Checkout",
//     }
//     );
// }

/*
        .then(cart => {
            // with access to the cart -> we have access to products in the cart
            fetchedCart = cart;
            return cart.getProducts();
        })

                        product.orderItem =
                        {
                            quantity: product.cartItem.quantity
                        };
                        return product;
                    }));
                })
                .then(order => {
                    return fetchedCart.setProducts(null)
                }).then(() => {
                    res.redirect("/orders")
                })
                .catch(err => {
                    console.log(err)
                });
        })
        .catch(err => {
            console.log(err)
        });

*/
