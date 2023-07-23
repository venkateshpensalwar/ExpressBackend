const mongoose = require("mongoose");
const { Schema } = mongoose;

const Employee = new Schema({
  name: {
    type: String,
    required: true,
  },
  address: {
    type: String,
    required: true,
  },
  image: {
    type: String,
    required: false,
  },
  profile: {
    type: String,
    required: true,
  },
});

module.exports = mongoose.model("employee", Employee);
