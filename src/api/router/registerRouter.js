const fs = require("fs");
const path = require("path");
const { Router } = require("express");
const router = Router();

const {
  middlewareValidate,
} = require("../middlewares/validateSchemaMiddleware");
const { middlewareController } = require("../middlewares/controllerMiddleware");
const { dinamicMiddleware } = require("../middlewares/dinamicMiddleware");

function* getRouteFiles(dir) {
  const files = fs.readdirSync(dir, { withFileTypes: true });

  for (const file of files) {
    if (file.isDirectory()) {
      yield* getRouteFiles(path.join(dir, file.name));
    } else if (
      /((?:([R-r]outer)))/g.test(file.name) &&
      file.name !== path.basename(__filename)
    ) {
      yield `${dir}/${file.name}`;
    }
  }
}

for (const filePath of getRouteFiles(__dirname)) {
  try {
    const {
      name,
      method,
      path: routePath,
      validate,
      service,
      argument,
      handlers,
      handlersFirst = false,
      params,
      status,
    } = require(filePath)[0];

    const middlewares = [
      dinamicMiddleware(handlers, params),
      middlewareValidate(routePath, validate, name),
    ];

    if (handlersFirst) {
      middlewares.reverse();
    }

    if (status) {
      router[method](
        argument,
        ...middlewares,
        middlewareController(name, service)
      );
    }
  } catch (error) {
    throw { message: error };
  }
}
const ErrorHandler = (err, req, res, next) => {
  console.log(err);
  const errStatus = err.statusCode || 422;
  const errMsg = err.message || "Something went wrong";
  res.status(errStatus).json({
    success: false,
    message: errMsg,
  });
};
router.use(ErrorHandler);

router.use((req, res, next) => {
  if (req.originalUrl.endsWith("/favicon.ico")) {
    res.sendStatus(204);
  }
  if (
    /\.[0-9a-zA-Z]+$/i.test(req.originalUrl) ||
    /(\.[0-9a-z-A-Z]*)/im.test(req.originalUrl)
  ) {
    res.status(401).jsonp({
      code: "unauthorized",
      message: "Unauthorized referral access",
    });
  }
  next();
});

// function logResponseBody(req, res, next) {
//   var oldWrite = res.write,
//       oldEnd = res.end;

//   var chunks = [];

//   res.write = function (chunk) {
//     chunks.push(chunk);

//     return oldWrite.apply(res, arguments);
//   };

//   res.end = function (chunk) {
//     if (chunk)
//       chunks.push(chunk);

//     var body = Buffer.concat(chunks).toString('utf8');
//     console.log(req.path, body);

//     oldEnd.apply(res, arguments);
//   };

//   next();
// }

// router.use(logResponseBody);

module.exports = router;
