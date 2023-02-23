exports.restrictToMiddleware =(req, res, next) => {
  console.log("checkout aqui faz", req.body);
  next();
}

// module.exports = {
//     customMiddleware1
// }