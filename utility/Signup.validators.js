const { body } = require("express-validator");
const user = require("../Models/User.model");
const { Promise } = require("mongoose");

module.exports.checkPassword = body(["cpassword", "password"])
  .isLength({ min: 3 })
  .custom((value, { req }) => {
    if (value !== req.body.password) {
      throw new Error("Entered password does not match please try again");
    }
    return true;
  });

module.exports.checkEmail = body("email")
  .isEmail()
  .custom((value, { req }) => {
    return user
      .findOne({
        email: value,
      })
      .then((res) => {
        if (res) {
          return Promise.reject();
        }
      });
  })
  .normalizeEmail()
  .withMessage("User with given email id is already present");
