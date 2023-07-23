const express = require("express");
const mongoose = require("mongoose");
const path = require("path");
const Application = express();
const multer = require("multer");
const cors = require("cors");

const EmployeeRoutes = require("./Routes/Employee.route");
const AuthRoutes = require("./Routes/Auth.route");
const { HandleErrors } = require("./GlobalMiddleware/Handle.controllers");
const FileStore = require("./Utility/FileUploader");

const {socket}  = require('./utility/Socket.io')

Application.options('*',cors())
Application.use(express.json());
Application.use(express.urlencoded({extended:true}));
Application.use(
  multer({ storage: FileStore.storage, fileFilter: FileStore.fileFilter }).single("image")
);

Application.use("/Images", express.static(path.join(__dirname, "Images")));

Application.use((req, res, next) => {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "*");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type,Authorization");
  next();
});

Application.use(EmployeeRoutes);

Application.use('/auth',AuthRoutes);

Application.use(HandleErrors);

mongoose
  .connect("mongodb://127.0.0.1:27017/UdayPetroSoft")
  .then((result) => {
    const ExpressServer = Application.listen(3000);
    const SocketConnection = socket(ExpressServer);
    SocketConnection.on("connection", () => {
      console.log("A new client connected");
    });
  })
  .catch((err) => console.log(err));
