const fs = require('fs');

//!---------------- if statements & default response code -------------- //
const requestHandler = (req, res) => {
    const url = req.url;
    const method = req.method;

    if (url === '/') {
        //ّ* ---------------------------------------------------------- */
        /*
            load a page where the user can enter some data which we then store in
            a file on the server once it's sent... we can do this by:
            -> parsing the url 
        */
        res.write('<html>');
        res.write('<head><title>Enter Message</title><head>');
        res.write(
            '<body><form action="/message" method="POST"><input type="text" name="message"><button type="submit">Send</button></form></body>'
        );
        res.write('</html>');
        return res.end();
    }
    if (url === '/message' && method === 'POST') {
        /* get request data before sending response by registering event listener on req 
    */
        const body = [];
        req.on('data', chunk => {
            body.push(chunk);
            //console.log(chunk, "chunks");
        });
        // register end event listener
        return req.on('end', () => {
            // create a new buffer & add all chunks from inside body to it 
            // we convert it into string because it's a text, if it was a fill we'd do a different thing
            const parsedBody = Buffer.concat(body).toString();
            //console.log(parsedBody, "parsedBody");
            const message = parsedBody.split('=')[1];
            //1. create a file & store the message the user entered in it 
            //* write a file takes a path to a file 
            //2.redirect the user to "/"
            //* write head --> to write some meta info 
            fs.writeFile('message.txt', message, err => {
                res.statusCode = 302;
                res.setHeader('Location', '/');
                return res.end();
            });
        });
    }
    // 1. set the headers 
    res.setHeader("Content-Type", "text/html");
    /* 2. 
    write some data to the response in:
    chunks or 
    multiple lines 
    */
    res.write("<html>");
    res.write("<head><title>My first page</title></head>");
    res.write("<body><h1>Hello from my node js server</h1></body>");
    res.write("</html>");
    // 3. creating that response 
    res.end();
    /* after that we can't write anymore and res.write() will throw error
    because this is the part where we send back the response to the client
    */
}
// 1.
//module.exports = requestHandler;

// 2.export many things
// module.exports = {
//     handler: requestHandler,
//     someText: "Some hard coded text",
// }

//3. multiple exports 
// module.exports.handler = requestHandler;
// module.exports.someText = "Some hard coded text";

//4. shortcuts 
exports.handler = requestHandler;
exports.someText = "Some hard coded text";