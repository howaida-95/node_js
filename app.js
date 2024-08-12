// server.listen(3000);
const http = require('http');
const routes = require('./routes');
console.log(routes.someText, "routes.someText")

const server = http.createServer(routes.handler);

server.listen(3000);
/*
result
======
<Buffer 6d 65 73 73 61 67 65 3d 74 65 73 74> chunks
message=test parsedBody
*/
