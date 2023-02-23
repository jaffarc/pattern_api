function importFileMiddleware(key) {
  let requires = {};
  try {
    for (let namefunc of key) {
      if (!requires[namefunc]) {
        requires[namefunc] = require(`../customMiddleware/${namefunc}`);
      }
    }
    return { ...requires };
  } catch (error) {
    console.log("Nao achou o arquivo", error);
  }
}

const dinamicMiddleware = (handlers) => {
  return (req, res, next) => {
    function run(index) {
      if (index < handlers.length) {
        importFileMiddleware(handlers)[handlers[index]][handlers[index]](
          req,
          res,
          function (err) {
            if (err) {
              return next(err);
            }
            index += 1;
            run(index);
          }
        );
      }
      next();
    }
    run(0);
  };
};

module.exports = {
  dinamicMiddleware,
};
