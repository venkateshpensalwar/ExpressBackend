const express = require("express");
const { login, signup } = require("../Controllers/Auth.controller");
const { checkEmail, checkPassword } = require("../utility/Signup.validators");
const { checkName } = require("../utility/Employee.validators");
const router = express.Router();

router.post("/login", login);
router.post("/signup", [checkName, checkEmail, checkPassword], signup);

module.exports = router;
