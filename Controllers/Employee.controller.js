const Employee = require("../Models/Employee.model");
const EmpAttendance = require("../Models/Attendance.model");

const {validationResult} = require("express-validator");
const { DeleteFile } = require("../Utility/FileUploader");
const path = require("path");
const socket = require("../utility/Socket.io");

module.exports.GetEmployees = (req, res, next) => {
  Employee.find().select(['-attendance','-__v'])
    .then((response) => {
      res.status(200).json(response);
    })
    .catch((err) => console.log(err));
};

module.exports.AddNewEmployee = (req, res, next) => {
 const errors = validationResult(req);

 if (!errors.isEmpty()) {
   const error = new Error("Validation Failed please check form!!");
   error.status = 422;
   error.validations = errors.array();
   throw error;
 }

  const emp = new Employee({
    name: req.body.name,
    address: req.body.address,
    profile: req.body.profile,
    image: req.file.filename,
  });

  emp
    .save()
    .then((response) => {
    socket.getSocketIO().emit("create", response);
     res.status(200).json(response);
    })
    .catch((err) => {
      console.log(err)
      if (!err.status) {
        const error = new Error("Internal server error!");
        error.statusCode = 500;
        next(error);
      }
    });
};

module.exports.GetAttendance = (req, res, next) => {
  const perPageAmount = 3;
  const currentPageNumber = +req.query.page;
  let totalData;
  const id = req.body.id;
  const search = req.body.search;

  EmpAttendance.find({
    empId: id,
    date: { $gte: new Date(search) },
  })
    .countDocuments()
    .then((response) => {
      totalData = response;
      return EmpAttendance.find({
        empId: id,
        date: { $gte: new Date(search) },
      })
        .limit(perPageAmount)
        .skip((currentPageNumber - 1) * perPageAmount);
    })
    .then((response) => {
      if (response.length >= 1) {
        res
          .status(200)
          .json({
            response,
            totalData: totalData,
            perPageAmount: perPageAmount,
          });
      } else {
        res.status(404).json({ message: "No Record Found" });
      }
    })
    .catch((err) => {
      console.log(err);
      if (!err.status) {
        const error = new Error("Internal server error!");
        error.statusCode = 500;
        next(error);
      }
    });
};

module.exports.MarkAttendance = (req, res, next) => {
  const id = req.body.id;
  const date = req.body.date;
  const month = req.body.month;
  const status = req.body.status;
  // populate('attendance') to get data of array

  const addAttendance = new EmpAttendance({
    empId: id,
    date: date,
    month: month,
    status: status,
  });

  EmpAttendance.find({
    date: date,
    month: month,
  })
    .then((response) => {
      if (response.length === 1) {
        res.status(200).json({message: "Attendance already present" });
      } else {
        addAttendance.save().then(() => {
          res.status(200).json({
            message: "Attendance marked as " + status,
          });
        });
      }
    })
    .catch((err) => {
      if (!err.status) {
        const error = new Error("Internal server error!");
        error.statusCode = 500;
        next(error);
      }
    });
};

module.exports.DeleteEmployee = (req, res, next) => {
  const id = req.params.id;
  Employee.findById(id)
    .then((response) => {
      DeleteFile(path.join("Images", response.image));
      response.deleteOne();
      EmpAttendance.deleteMany().then((deleted) => {
        res.status(200).json({ message: "User record has been Deleted" });
      });
    })
    .catch((err) => {
      console.log(err);
      if (!err.status) {
        const error = new Error("Internal server error!");
        error.statusCode = 500;
        next(error);
      }
    });
};

module.exports.EditEmployee = (req, res, next) => {
  const image = req.file;
  Employee.findById(req.body.id)
    .then((response) => {
      response.name = req.body.name;
      response.profile = req.body.profile;
      response.address= req.body.address;
      if (image) {
        DeleteFile(path.join("Images", response.image));
        response.image = req.file.filename;
      }
      response.save().then((data) => {
        res.status(200).json({ message: "Employee updated successfully" });
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