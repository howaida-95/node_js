const Product = require("../models/product");

exports.getAddProduct = (req, res, next) => {
  // check if the user is authenticated or not first before rendering the page
  if (!req.session.isLoggedIn) {
    return res.redirect("/login");
  }
  res.render("admin/edit-product", {
    pageTitle: "Add Product",
    path: "/admin/add-product",
    editing: false,
  });
};

exports.postAddProduct = (req, res, next) => {
  const title = req.body.title;
  const imageUrl = req.body.imageUrl;
  const price = req.body.price;
  const description = req.body.description;
  // null for product id
  const product = new Product({
    // left --> schema key || right --> body data
    title,
    imageUrl,
    price,
    description,
    // we can store entire object & mongoose will pick that id from the object
    userId: req.user._id,
  });
  product
    .save()
    .then((result) => {
      console.log("Created Product");
      res.redirect("/admin/products");
    })
    .catch((err) => {
      console.log(err);
    });
};

exports.getEditProduct = (req, res, next) => {
  const editMode = req.query.edit;
  if (!editMode) {
    return res.redirect("/");
  }
  const prodId = req.params.productId;
  Product.findById(prodId)
    .then((product) => {
      if (!product) {
        return res.redirect("/");
      }
      res.render("admin/edit-product", {
        pageTitle: "Edit Product",
        path: "/admin/edit-product",
        editing: editMode,
        product: product,
      });
    })
    .catch((err) => console.log(err));
};

exports.postEditProduct = (req, res, next) => {
  /*
  check if the product created by the logged in user 
  */
  const prodId = req.body.productId;
  const updatedTitle = req.body.title;
  const updatedPrice = req.body.price;
  const updatedImageUrl = req.body.imageUrl;
  const updatedDesc = req.body.description;
  Product.findById(prodId)
    .then((product) => {
      if (product.userId.toString() !== req.user._id.toString()) {
        return res.redirect("/");
      }
      product.title = updatedTitle;
      product.price = updatedPrice;
      product.imageUrl = updatedImageUrl;
      Product.description = updatedDesc;
      return product.save().then((result) => {
        console.log("UPDATED PRODUCT!");
        res.redirect("/admin/products");
      });
    })

    .catch((err) => console.log(err));
};

exports.getProducts = (req, res, next) => {
  /*
  render products that created only by logged user 
  autherization --> means restrict permissions 
  userId === logged in user 
  */
  Product.find({ userId: req.user._id })
    .then((products) => {
      res.render("admin/products", {
        prods: products,
        pageTitle: "Admin Products",
        path: "/admin/products",
      });
    })
    .catch((err) => console.log(err));
};

exports.postDeleteProduct = (req, res, next) => {
  /*
  check if the product created by the logged in user 
  */
  const prodId = req.body.productId;
  // productId --> input name , its value --> input value, router --> form action
  // Product.findByIdAndDelete(prodId)
  //   .then((result) => {
  //     console.log("DESTROYED PRODUCT");
  //     res.redirect("/admin/products");
  //   })
  //   .catch((err) => console.log(err));

  Product.deleteOne({ _id: prodId, userId: req.user._id }) // user id & id --> should match
    .then(() => {});
};
