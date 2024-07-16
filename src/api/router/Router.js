const { Router } = require("express");
const { dinamicMiddleware } = require("../middlewares/dinamicMiddleware");
const {
  middlewareValidate,
} = require("../middlewares/validateSchemaMiddleware");
const { middlewareController } = require("../middlewares/controllerMiddleware");
const {
  capturelogMiddleware,
} = require("../customMiddleware/capturelogMiddleware");

const router = Router();

const Swagger = require("../swagger/classSwagger");
const RouteLoader = require("./createSwagger");

const routeConfigs = RouteLoader.loadRoutes();
const swaggerRouter = Swagger.initialize(routeConfigs);

router.use(swaggerRouter);

for (const filePath of routeConfigs) {
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
    } = filePath;

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
    console.log(argument);
  } catch (error) {
    console.log('ssssss')
    throw { message: error };
  }
}

const ErrorHandler = (err, _req, res, _next) => {
  const errStatus = err.statusCode || 422;
  const errMsg = err.message || "Something went wrong";
  // if (err.status === 404) {
    //   return res.redirect("/api-docs");
    // }
    res.status(errStatus).json({
      success: false,
      message: errMsg,
    });
  };
  router.use(ErrorHandler);
  
  // router.use((req, res, next) => {
  //   console.log('AAAAAA')
  //   if (req.originalUrl.endsWith("/favicon.ico")) {
  //     res.sendStatus(204);
  //   }
  //   if (
  //     /\.[0-9a-zA-Z]+$/i.test(req.originalUrl) ||
  //     /(\.[0-9a-z-A-Z]*)/im.test(req.originalUrl)
  //   ) {
  //     res.status(401).json({
  //       code: "unauthorized",
  //       message: "Unauthorized referral access",
  //     });
  //   }
  //   next();
  // });
  
  module.exports = router;
  