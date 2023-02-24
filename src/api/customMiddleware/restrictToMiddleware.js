exports.restrictToMiddleware =(req, res, next) => {
  console.log("restrictToMiddleware::", req.body);
  next();
}

// module.exports = {
//     customMiddleware1
// }