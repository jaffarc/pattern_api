function importFileMiddleware(key) {
  const requires = {};
  for (const namefunc of key) {
    requires[namefunc] = require(`../customMiddleware/${namefunc}`);
  }
  return requires;
}

const dinamicMiddleware = (handlers) => {
  const middleware = importFileMiddleware(handlers);

  return (req, res, next) => {
    function run(index) {
      if (index < handlers.length) {
        const handler = middleware[handlers[index]][handlers[index]];
        handler(req, res, function (err) {
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
