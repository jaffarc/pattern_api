exports.restrictToMiddleware =(req, res, next) => {
  console.log("checkout aqui faz");
  next();
}

// module.exports = {
//     customMiddleware1
// }