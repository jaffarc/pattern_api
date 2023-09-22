exports.validateDateMiddleware = () => {
 return (req, res, next) => {
    req["user"] = { role: "user" };
    next();
  };
};
