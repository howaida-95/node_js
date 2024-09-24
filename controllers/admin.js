const Product = require("../models/product");

// this is what we do --> get add product page 
exports.getAddProduct = (req, res, next) => {
    res.render("admin/add-product", {// render view 
        path: "/admin/add-product",
        pageTitle: "add product",
        editing: false
    });
}

// adding a new product 
exports.postAddProduct = (req, res, next) => {
    // create an object based on the class blueprint
    const title = req.body.title;
    const imageUrl = req.body.imageUrl;
    const price = req.body.price;
    const description = req.body.description;
    // sequelize create method to create new element & store it to db (1 step)
    // build does the same but create it in js first & then save it to database (2 steps)
    Product.create({
        title, imageUrl, price, description
    }).then(result => {
        console.log(result);
    }).catch(err => {
        console.log(err)
    });
}

// edit product 
exports.getEditProduct = (req, res, next) => {
    // query param --> ?key=value & key=value 
    const editMode = req.query.edit; // extracted query value is always string
    if (!editMode) {
        return res.redirect("/");
    }
    const prodId = req.params.productId;
    Product.findById(prodId, product => {
        if (!product) {
            return res.redirect("/");
        }
        res.render("admin/edit-product", {// render view 
            path: "/admin/edit-product",
            pageTitle: "Edit Product",
            editing: editMode,
            product: product
        });
    })
}

exports.postEditProduct = (req, res, next) => {
    // fetch info for the product 
    const id = req.body.productId;
    const title = req.body.title;
    const imageUrl = req.body.imageUrl;
    const price = req.body.price;
    const description = req.body.description;
    const updatedProduct = new Product(id, title, imageUrl, price, description);
    // save the product 
    updatedProduct.save();
    res.redirect("/admin/products");
}

// adding a new product 
exports.getProducts = (req, res, next) => {
    // then & catch because we use promises
    Product.findAll().then((product) => {
        res.render("admin/products", {// render view 
            path: "/admin/products",
            pageTitle: "Admin products",
            prods: product
        });
    }).catch((err) => { console.log(err) })
}

exports.postDeleteProduct = (req, res, next) => {
    // console.log(req.body, "prodIdprodId")
    const prodId = req.body.productId;
    Product.deleteById(prodId);
    res.redirect("/admin/products")
}