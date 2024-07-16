/**
 * @description Se os param enviado ocorrer um erro. interno no middleware JSON mal formado
 */
const validateType = (err, req, res, next) => {
  if (
    err instanceof SyntaxError &&
    err.status >= 400 &&
    err.status < 500 &&
    err.message.indexOf("JSON") !== -1
  ) {
    return res
      .status(500)
      .jsonp({ sucess: false, result: "Object json invalid" });
  }
  next();
};
module.exports = {
  validateType,
};
