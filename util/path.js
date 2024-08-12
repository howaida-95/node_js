const path = require('path');
module.exports = path.dirname(process.mainModule.filename);
// give you the directory path of the current module.
//module.exports = process.cwd()