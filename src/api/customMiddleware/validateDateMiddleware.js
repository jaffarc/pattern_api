exports.validateDateMiddleware = () => {
 return (req, res, next) => {
    console.log("validateDateMiddleware");
    req["user"] = { role: "user" };
    next();
  };
};
