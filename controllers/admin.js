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
    console.log("====================");
    console.log(req.user);
    console.log("====================");
    const title = req.body.title;
    const imageUrl = req.body.imageUrl;
    const price = req.body.price;
    const description = req.body.description;
    /* 
        create a new associated object
        since a user has many products
        ==> this automatically creates a connected model
    */
    req.user.createProduct({
        title: title,
        imageUrl: imageUrl,
        price: price,
        description: description,
    }).then(result => {
        console.log(result);
    }).catch(err => {
        console.log(err)
    });

    // sequelize create method to create new element & store it to db (1 step)
    // build does the same but create it in js first & then save it to database (2 steps)
    //Product.create({
    //title: title,
    //imageUrl: imageUrl,
    //price: price,
    //description: description,
    //userId: req.user.id // create a product with a user associate to it (here's manually)
    //})
}
// edit product 
exports.getEditProduct = (req, res, next) => {
    // query param --> ?key=value & key=value 
    const editMode = req.query.edit; // extracted query value is always string
    if (!editMode) {
        return res.redirect("/");
    }
    const prodId = req.params.productId;

    Product.findByPk(prodId).then((product) => {
        if (!product) {
            return res.redirect("/");
        }
        res.render("admin/edit-product", {// render view 
            path: "/admin/edit-product",
            pageTitle: "Edit Product",
            editing: editMode,
            product: product
        });
    }).catch(err => console.log(err))
}

exports.postEditProduct = (req, res, next) => {
    // fetch info for the product 
    const prodId = req.body.productId;
    const title = req.body.title;
    const imageUrl = req.body.imageUrl;
    const price = req.body.price;
    const description = req.body.description;
    // find the product by id 
    Product.findByPk(prodId).then(product => {
        /*
        =>  that product now need to be updated
        */
        // 1.edit the product 
        product.title = title;
        product.price = price;
        product.description = description;
        product.imageUrl = imageUrl;
        // 2. save it to the database
        return product.save();
    })
        .then((result) => {
            console.log(result)
            res.redirect("/admin/products");
        })
        // this will catch error for 1st & 2nd promise
        .catch(err => console.log(err))

    // const updatedProduct = new Product(id, title, imageUrl, price, description);
    // // save the product 
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
    Product.destroy(prodId).then(() => {
        res.redirect("/admin/products")
    }).catch((err) => {
        console.log(err)
    });
}