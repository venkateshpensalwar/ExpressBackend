let socketIO;

module.exports.socket = (httpServer) => {
  socketIO = require("socket.io")(httpServer, {
    cors: {
      origin: "http://localhost:4200",
      methods: ["GET", "POST","DELETE","PUT","PATCH"],
    },
  });
  return socketIO;
};

module.exports.getSocketIO = () => {
  if (!socketIO) {
    throw new Error("Socket.io is not working check server!!");
  }
  return socketIO;
};
