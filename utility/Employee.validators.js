const { body,check }  = require("express-validator");

module.exports.checkName = body("name")
  .not()
  .isEmpty()
  .trim()
  .withMessage("Please Enter a valid user name");

module.exports.checkProfile = body("profile")
  .not()
  .isEmpty()
  .trim()
  .withMessage("Please Enter a valid profile");

module.exports.address = body("address")
  .not()
  .isEmpty()
  .trim()
  .withMessage("Please Enter a valid address");

  module.exports.checkFile = check("image")
    .isEmpty()
    .custom((value, { req }) => {
      if (
        req.file.mimetype == "image/jpeg" ||
        req.file.mimetype == "image/png" ||
        req.file.mimetype == "image/jpg"
      ) {
        return true;
      }
    })
    .withMessage("Please select the valid file type e.g. JPEG,JPG,PNG");
