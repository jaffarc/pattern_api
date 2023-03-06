const fs = require("fs");
const path = require("path");
const { Router } = require("express");
const {middlewareValidate} = require("../middlewares/validateSchemaMiddleware");
const { middlewareController } = require("../middlewares/controllerMiddleware");
const { dinamicMiddleware } = require("../middlewares/dinamicMiddleware");
const {capturelogMiddleware} = require("../customMiddleware/capturelogMiddleware");

const router = Router()


const  Swagger  = require('../swagger/classSwagger');

const RouteLoader = require('./createSwagger');
const routeConfigs = RouteLoader.loadRoutes();

console.log(routeConfigs)
const swaggerRouter = Swagger.initialize(routeConfigs);


router.use(swaggerRouter)



function* getRouteFiles(dir) {
  const files = fs.readdirSync(dir, { withFileTypes: true });

  for (const file of files) {
    if (file.isDirectory()) {
      yield* getRouteFiles(path.join(dir, file.name));
    }
    if (
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
      description,
      validate,
      service,
      argument,
      handlers,
      params,
      getLog,
      handlersFirst = false,
      status,
    } = require(filePath)[0];

    const middlewares = [middlewareValidate(routePath, validate, name)];

    if (handlers) {
      middlewares.push(dinamicMiddleware(handlers, params));
    }
    if (handlersFirst) {
      middlewares.reverse();
    }
    
    if (getLog) {
      middlewares.unshift(capturelogMiddleware());
    }


    if (status) {
      router[method](
        argument,
        middlewares,
        middlewareController(name, service)
      );
    }
  } catch (error) {
    throw { message: error };
  }
}

//  router[ ];

const ErrorHandler = (err, req, res, next) => {
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


module.exports = router;
