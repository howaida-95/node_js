const sum = (a, b) => {
  if (a && b) {
    return a + b;
  }
  // throwing error --> is a built-in functionality
  throw new Error("Invalid arguments");
};

try {
  console.log(sum(1));
} catch (error) {
  console.log("error occurred!");
  //console.log(error);
}

console.log("errrrrrrrrrrrrrrr");
/*
node in a lot of packages that we use throw errors behind the scenes 
ex:
---
mongodb will throw an error if we can't connect to the database
or if an operation fails
if we don't handle them, then our application just crashes

---------------------------------------------------------
how to handle errors 
---------------------
1- for synchronous code (executed line by line not dealing with files & requests)
=> using try and catch blocks (catch the error and  continue to execute the following code)

2- for async operations
such operations when using promises we use then & catch
if there's more than one then catch will catch any error that occurs in any of the then blocks
*/
