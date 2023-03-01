const middlewareCache = {};

function importFileMiddleware(key) {
  if (!key) {
    return {};
  }
  const requires = {};
  for (const name of key) {
    if (middlewareCache[name]) {
      return (requires[name] = middlewareCache[name]);
    }
    requires[name] = require(`../customMiddleware/${name}`);
    middlewareCache[name] = requires[name];
  }
  return requires;
}

const dinamicMiddleware = (handlers, params) => {
  if (handlers) {
    const middleware = importFileMiddleware(handlers);
    return (req, res, next) => {
      function run(index) {
        if (index >= handlers.length) {
          return next();
        }
        const handler = middleware[handlers[index]][handlers[index]];
        console.log("AAA", params, handlers[index]);
        handler(params ? params[handlers[index]] : "")(
          req,
          res,
          function (err) {
            if (err) {
              return next(err);
            }
            console.log("aaaa", handlers, index);
            run((index += 1));
          }
        );
        next();
      }
      run(0);
    };
  }
};

module.exports = {
  dinamicMiddleware,
};
