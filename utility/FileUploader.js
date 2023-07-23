const multer = require('multer');
const fs = require("fs")


module.exports.storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "Images");
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
    cb(null, uniqueSuffix + file.originalname);
  },
});

module.exports.fileFilter = (req, file, cb) =>  {
   if (
     file.mimetype == "image/jpeg" ||
     file.mimetype == "image/png" ||
     file.mimetype == "image/jpg"
   ) {
     // To accept the file pass `true`, like so:
     cb(null, true);
   } else {
     // To reject this file pass `false`, like so:
     cb(null, false);
   }
}


module.exports.DeleteFile = (FilePath) => {
  fs.unlink(FilePath, (err) => {
    if (err) {
      throw new Error(err);
    }
  });
};
