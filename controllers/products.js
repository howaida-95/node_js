const products = [];

// this is what we do --> get add product page 
exports.getAddProduct = (req, res, next) => {
    res.render("add-product", {// render view 
        pageTitle: "add product",
        path: "admin/add-product",
        activeAddProduct: true,
        productCSS: true,
        formsCSS: true
    });
}

// adding a new product 
exports.postAddProduct = (req, res, next) => {
    products.push({ title: req.body.title });
    res.redirect("/");
}

// get all products
exports.getProducts = (req, res, next) => {
    res.render("shop", { // render the view
        prods: products,
        pageTitle: "Shop",
        path: "/",
        activeShop: true,
        hasProducts: products.length > 0,
        productCss: true,
        //layout: false --> use default layout or not using it
    }
    );
}