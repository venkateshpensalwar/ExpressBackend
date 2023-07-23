const mongoose = require("mongoose");
const { Schema } = mongoose;

const EmpAttendance = new Schema({
  empId: {
    ref: "employee",
    required: true,
    type: mongoose.Types.ObjectId
  },
  date: {
    type: Date,
    required: true,
  },
  status: {
    type: String,
    required: true,
  },
  month: {
    type: String,
    required: true,
  },
});

module.exports = mongoose.model("attendance", EmpAttendance);
