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
};
