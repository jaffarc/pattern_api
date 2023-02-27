function importFileMiddleware(key) {
  const requires = {};
  for (const namefunc of key) {
    requires[namefunc] = require(`../customMiddleware/${namefunc}`);
  }
  return requires;
}

const dinamicMiddleware = (handlers, params) => {
  const middleware = importFileMiddleware(handlers);
  return (req, res, next) => {
    if (!handlers) {
      next();
    }
    function run(index) {
      if (index < handlers.length) {
        const handler = middleware[handlers[index]][handlers[index]];
        // console.log(typeof params[handlers[index]])
        handler(params[handlers[index]])(req, res, function (err) {
          if (err) {
            return next(err);
          }
          index += 1;
          run(index);
        });
      }
      next();
    }

    run(0);
  };
};

module.exports = {
  dinamicMiddleware,
};
