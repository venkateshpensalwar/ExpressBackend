const mongoose = require("mongoose");
const { Schema } = mongoose;

const User = new Schema({
  name: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
  },
  image: {
    type: String,
    required: false,
  },
  password: {
    type: String,
    required: true,
  },
  status:{
    type: String,
    required: false,
    default: 'offline'
  }
});

module.exports = mongoose.model("Authentication", User);
