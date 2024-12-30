const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const userSchema = new Schema({
  // how the user should look like
  // name: {
  //   type: String,
  //   required: true,
  // },
  email: {
    type: String,
    required: true,
  },
  password: {
    type: String,
    required: true,
  },
  cart: {
    // array of documents (embedded document)
    items: [
      {
        productId: {
          type: Schema.Types.ObjectId,
          required: true,
          ref: "Product",
        },
        quantity: {
          type: Number,
          required: true,
        },
      },
    ],
  },
});

/*
methods key is an object that allows to add our own methods 
*/
userSchema.methods.addToCart = function (product) {
  /* 1. check if this product is already inside the cart --> increase the quantity */
  // find the index of the product with the same id of the added product
  const cartProductIndex = this.cart?.items?.findIndex((cp) => {
    return cp.productId.toString() === product._id.toString(); // index or -1 (if not exist)
  });

  // 2. add quantity field
  let newQuantity = 1;
  const updatedCartItems = [...this.cart.items]; // new array with all items in the cart
  if (cartProductIndex >= 0) {
    newQuantity = this.cart.items[cartProductIndex].quantity + 1;
    updatedCartItems[cartProductIndex].quantity = newQuantity; // edit the array without touching the old array
  } else {
    updatedCartItems.push({
      // the names used in schema --> productId & quantity
      productId: product._id,
      quantity: newQuantity,
    });
  }
  const updatedCart = {
    items: updatedCartItems,
  };
  this.cart = updatedCart;
  // update the user to store the cart at there
  return this.save();
};

userSchema.methods.deleteItemFromCart = function (productId) {
  const updatedCartItems = this.cart.items.filter((item) => {
    return !item.productId.equals(productId);
  });
  this.cart.items = updatedCartItems;
  return this.save();
};

userSchema.methods.clearCart = function () {
  this.cart = { items: [] };
  return this.save();
};

module.exports = mongoose.model("User", userSchema);
