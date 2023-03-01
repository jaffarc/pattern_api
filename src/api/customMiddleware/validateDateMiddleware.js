exports.validateDateMiddleware = () => {
 return (req, res, next) => {
    console.log("checgo aqui");
    req["user"] = { role: "user" };
    next();
  };
};
