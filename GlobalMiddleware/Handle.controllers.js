const jwt = require("jsonwebtoken")

module.exports.isAuthenticated = (req, res, next) => {
  const token = req.get("Authorization");
  if (req.get("Authorization")) {
    verified = jwt.verify(token, "mysecrect",(error,decoded)=>{
      if(error){
        if (error.message === "jwt expired") {
          const err = new Error(
            "User could not be verified please Login again"
          );
          err.status = 403;
          throw err;
        } else {
          const err = new Error("User is not Authenticated");
          err.status = 401;
          throw err;
        }
        
      }
    })
  } else {
    const err = new Error("User is not Authenticated");
    err.status = 401;
    throw err;
  }
  next();
};


module.exports.HandleErrors = (err, req, res, next) => {
  let validationResult;
  const status = err.status || 500;
  const response = err.message;
  if (err.validations) {
    validationResult = err.validations;
  } else {
    validationResult = undefined;
  }
   console.log(err);
  res.status(status).json({ message: response, validationResult });
};
