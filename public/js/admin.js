/*
this form for sending the request through the browser 
=> 
<form action="/admin/delete-product" method="POST">
    <input type="hidden" value="<%= csrfToken %>" name="_csrf" />
    <input type="hidden" value="<%= product._id %>" name="productId">
    <button class="btn" type="submit">Delete</button>
</form>

sending request with this XXW url form encoded data 
-----------------------------------------------------------
using the form in that way 
we listen to click on the button 
then gathering the productId & csrf token 

<input type="hidden" value="<%= csrfToken %>" name="_csrf" />
<input type="hidden" value="<%= product._id %>" name="productId">
<button class="btn" type="button">Delete</button>
*/

// this code run on the browser
const deleteProduct = (btn) => {
  console.log("clicked", btn);
  // send async request to a server
  const prodId = btn.parentNode.querySelector("[name=productId]").value;
  const csrf = btn.parentNode.querySelector("[name=_csrf]").value;

  const productElement = btn.closest("article");
  // fetch is a modern browser api
  // it's a promise based
  // it's a function that takes a url
  // it returns a promise
  // then we can chain then() method
  // we can also chain catch() method
  // the then() method takes a function
  // the function takes a response object
  // the response object has a json() method
  fetch(`/admin/product/${prodId}`, {
    // configuration object for this request
    method: "DELETE", // delete request doesn't have a body
    headers: {
      "csrf-token": csrf,
    },
  })
    .then((result) => {
      console.log(result);
      return result.json();
    })
    .then((data) => {
      console.log(data);
      console.log("Product deleted");
      // remove the parent element of the button
      productElement.remove();
    })
    .catch((err) => {
      console.log(err);
    });
};
/*
note
====
in app.js we have 2 body parser
1- one for  urlencoded data --> we don't have when we send json data 
2- one for multipart data 
*/
