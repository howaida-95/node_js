const fs = require("fs");

exports.deleteFile = (filePath) => {
  //delete the file that connected to the name
  fs.unlink(filePath, (err) => {
    if (err) {
      throw err;
    }
  });
};
