const express = require("express");
const {
  AddNewEmployee,
  GetEmployees,
  GetAttendance,
  MarkAttendance,
  DeleteEmployee,
  EditEmployee,
} = require("../Controllers/Employee.controller");
const validator = require("../utility/Employee.validators");
const { isAuthenticated }  = require("../GlobalMiddleware/Handle.controllers")

const router = express.Router();

router.get("/Employees", isAuthenticated, GetEmployees);

router.post("/Attendance", GetAttendance);
router.post("/MarkAttendance", MarkAttendance);

router.patch("/Employee/edit",EditEmployee)

router.delete("/Employee/:id",DeleteEmployee);

router.post(
  "/AddEmployee",
  [validator.address, validator.checkName, validator.checkProfile,validator.checkFile],
  AddNewEmployee
);

module.exports = router;
