const user  = require("../Models/User.model")
const bcrypt = require("bcryptjs");
const { validationResult } = require("express-validator");
const jwt = require("jsonwebtoken");
const { addHours } = require("../utility/Timer");

module.exports.login = (req, res, next) => {
  const email = req.body.email;
  const password = req.body.password;

  user
    .findOne({
      email: email,
    })
    .then((response) => {
      if (!response) {
       return res.status(404).json({ message: "No user found with given email id" });
      }
      bcrypt.compare(password, response.password).then((isValid) => {
        if (!isValid) {
          const err = new Error("Email or Password is wrong");
          err.status = 401;
          return next(err)
        }
       const jwtToken = jwt.sign({userId: response._id},"mysecrect",{expiresIn: '1h'});
       const expiry = addHours(new Date(),1);
          res.status(200).json({ message: "success" ,Authenticated: jwtToken,expiresIn:expiry});
      });
    })
    .catch((err) => {
      if (!err.status) {
        const error = new Error("Internal server error!");
        error.statusCode = 500;
        next(error);
      }
    });
};

module.exports.signup = (req, res, next) => {
  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    const error = new Error("Validation Failed please check form!!");
    error.status = 422;
    error.validations = errors.array();
    throw error;
  }

  const name = req.body.name;
  const email = req.body.email;
  const password = req.body.password;
  const cpassword = req.body.cpassword;

  bcrypt
    .hash(password, 12)
    .then((hasPasswd) => {
      if (hasPasswd) {
        const newUser = new user({
          name: name,
          email: email,
          password: hasPasswd,
        });
        return newUser.save();
      }
    })
    .then((response) => {
      res.status(200).json({ message: "User created successfully" });
    })
    .catch((err) => {
      if (!err.status) {
        const error = new Error("Internal server error!");
        error.statusCode = 500;
        next(error);
      }
    });
};