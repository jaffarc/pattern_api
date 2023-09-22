const fs = require('fs');
const path = require('path');

class RouteLoader {
  static *getRouteFiles(dir) {
    const files = fs.readdirSync(dir, { withFileTypes: true });

    for (const file of files) {
      
      if (file.isDirectory()) {
        yield* RouteLoader.getRouteFiles(path.join(dir, file.name));
      }
      if (
        /((?:([R-r]outer)))/g.test(file.name) &&
        file.name !== path.basename(__filename) && file.name !== 'Router.js'
      ) {
        yield `${dir}/${file.name}`;
      }
    }
  }

  static loadRoutes() {
    const routeConfigs = [];
// console.log(path.('../api/router/'))
    for (const filePath of RouteLoader.getRouteFiles(__dirname)) {
      try {
        // console.log(filePath)
        const routeConfig = require(filePath)[0];
        if (!routeConfig) continue; // skip to the next file if object is empty
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
          status
        } = routeConfig;

        routeConfigs.push({
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
          handlersFirst,
          status,
        });
      } catch (err) {
        console.error(`Error loading route file ${filePath}: ${err.message}`);
      }
    }

    return routeConfigs;
  }
}

module.exports = RouteLoader;
