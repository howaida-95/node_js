// cart & checkout
const Product = require("../models/product");
const Order = require("../models/order");
const fs = require("fs");
const path = require("path");
const PDFDocument = require("pdfkit");

const ITEMS_PER_PAGE = 2;

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
      });
    })
    .catch((err) => {
      const error = new Error(err);
      error.httpStatusCode = 500;
      return next(error);
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
      });
    })
    .catch((err) => {
      const error = new Error(err);
      error.httpStatusCode = 500;
      return next(error);
    });
};

exports.getIndex = (req, res, next) => {
  /*
    retrieve the info on which page we are 
    which data for which page needs to be displayed
  */
  const page = req.query.page || 1; // getting page number from query string
  // control the amount of data we retrieve from database

  Product.find()
    //  page -1 --> previous page number
    // limit the amount of items we retrieve from database
    .skip((page - 1) * ITEMS_PER_PAGE)
    .limit(ITEMS_PER_PAGE)
    .then((product) => {
      res.render("shop/index", {
        // render the view
        path: "/",
        pageTitle: "Shop",
        prods: product,
      });
    })
    .catch((err) => {
      const error = new Error(err);
      error.httpStatusCode = 500;
      return next(error);
    });
};

exports.getCart = async (req, res, next) => {
  try {
    const user = await req.user.populate("cart.items.productId");
    res.render("shop/cart", {
      path: "/cart",
      pageTitle: "Your cart",
      products: user.cart.items,
    });
  } catch (err) {
    const error = new Error(err);
    error.httpStatusCode = 500;
    return next(error);
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
      const error = new Error(err);
      error.httpStatusCode = 500;
      return next(error);
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
      const error = new Error(err);
      error.httpStatusCode = 500;
      return next(error);
    });
};

exports.getOrders = (req, res, next) => {
  Order.find({ "user.userId": req.user._id })
    .then((orders) => {
      res.render("shop/orders", {
        path: "/orders",
        pageTitle: "Your orders",
        orders: orders,
      });
    })
    .catch((err) => {
      const error = new Error(err);
      error.httpStatusCode = 500;
      return next(error);
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
          email: req.user.email,
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
    .catch((err) => {
      const error = new Error(err);
      error.httpStatusCode = 500;
      return next(error);
    });
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

// exports.getInvoice = (req, res, next) => {
//   // order id is encoded in url --> so we use params
//   const orderId = req.params.orderId;
//   Order.findById(orderId)
//     .then((order) => {
//       if (!order) {
//         return next(new Error("no order found"));
//       }
//       // check if the order is for the logged in user
//       if (order.user.userId.toString() !== req.user._id.toString()) {
//         return next(new Error("unauthorized"));
//       }

//       const invoiceName = `invoice-${orderId}.pdf`;
//       // data folder --> invoices folder --> file name
//       const invoicePath = path.join("data", "invoices", invoiceName);
//       // retrieve file with node file system
//       fs.readFile(invoicePath, (err, data) => {
//         // the data will be in buffer format
//         if (err) {
//           return next(err); // pass the error to the next middleware
//         }
//         /*
//         pass extra info to the browser
//         how this content should be served
//         inline --> to open in the browser
//         attachment --> to download
//         */
//         res.setHeader("Content-Disposition", `inline; filename="${invoiceName}"`);
//         res.setHeader("Content-Type", "application/pdf");
//         res.send(data); // send the pdf buffer to the client
//       });
//     })
//     .catch((err) => {
//       next(err);
//     });
// };

// exports.getInvoice = (req, res, next) => {
//   // order id is encoded in url --> so we use params
//   const orderId = req.params.orderId;
//   Order.findById(orderId)
//     .then((order) => {
//       if (!order) {
//         return next(new Error("no order found"));
//       }
//       // check if the order is for the logged in user
//       if (order.user.userId.toString() !== req.user._id.toString()) {
//         return next(new Error("unauthorized"));
//       }

//       const invoiceName = `invoice-${orderId}.pdf`;
//       // data folder --> invoices folder --> file name
//       const invoicePath = path.join("data", "invoices", invoiceName);
//       // retrieve file with node file system
//       const file = fs.createReadStream(invoicePath);
//       res.setHeader("Content-Disposition", `inline; filename="${invoiceName}"`);
//       res.setHeader("Content-Type", "application/pdf");
//       // forward the data that read from the file to the client
//       // so the response will be streamed to the browser
//       file.pipe(res);
//     })
//     .catch((err) => {
//       next(err);
//     });
// };

// create pdf file on the fly (not read it)
exports.getInvoice = (req, res, next) => {
  // order id is encoded in url --> so we use params
  const orderId = req.params.orderId;
  Order.findById(orderId)
    .then((order) => {
      if (!order) {
        return next(new Error("no order found"));
      }
      // check if the order is for the logged in user
      if (order.user.userId.toString() !== req.user._id.toString()) {
        return next(new Error("unauthorized"));
      }

      const invoiceName = `invoice-${orderId}.pdf`;
      // data folder --> invoices folder --> file name
      const invoicePath = path.join("data", "invoices", invoiceName);
      // create a new pdf document
      const pdfDoc = new PDFDocument(); // create a new pdf document & it's a readable stream
      res.setHeader("Content-Disposition", `inline; filename="${invoiceName}"`);
      res.setHeader("Content-Type", "application/pdf");
      /*
      1. pipe this output into a writable filestream
      2. pipe the output into a response 
      whatever we add to a doc will forward into that file (invoicePath) that gets generated on the fly
      and into our response

      The pdfDoc (PDF document stream) is piped into two places:
      A file stream (invoicePath) → Saves the PDF to disk.
      The response stream (res) → Sends the PDF directly to the client.
      */

      pdfDoc.pipe(fs.createWriteStream(invoicePath));
      pdfDoc.pipe(res);
      // add data to the pdf document
      //pdfDoc.text("Hello world!"); // add single line of text to pdf
      pdfDoc.fontSize(26).text("invoice", {
        underline: true,
      });
      let totalPrice = 0;
      order.products.forEach((prod) => {
        totalPrice += prod.quantity * prod.product.price; // calculate total price
        pdfDoc.fontSize(14).text(`${prod.product.title}  -${prod.quantity}x  $${prod.product.price}`);
      });
      pdfDoc.text(`------------------------`);
      pdfDoc.fontSize(20).text(`Total Price: $${totalPrice}`);
      pdfDoc.end(); // Closes the PDF stream, signaling that the document is complete.
    })
    .catch((err) => {
      next(err);
    });
};

/*
fs.readFile() ==>
once we read the file --> we send it to the client
that's fine with small files 
steps 
-----
- first node access the file 
- read the entire content into memory 
- then return the response 
-------------------------------------------------------
=> in case bigger files 
it will takes a lot of time to read the file before sent response 
and the memory on server will overflow at some time for incoming requests
because it has to read the entire file into memory(which is limited) before sending the response

reading file data into memory to serve it as a response ===> isn't a good practice
for tiny files -> it's ok 
for bigger files -> it isn't ok
================================
solution 
========
streaming the response data 
node never has to pre-load all the data into memory 
but streams it to the client on the fly
and the most it has to store is one chunk of data 
we work with --> chunks 
give us access to chunks --> buffers 
we don't wait for all the chunks to come together and concatenate them into one object 
instead we forward them to the browser
(which is also able to concatenate the incoming data pieces into the final file)
*/
