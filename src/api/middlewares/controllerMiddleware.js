const { resJsonP } = require("../../utils/helper");
const middlewareController = (path, serverName) => {
  let service = require(`../../service/${path}/${serverName}`);
  return (req, res, next) => {

    try {

      service[serverName]()
        .then((result) => {
          return resJsonP(res, 200, true, result);
        })
        .catch((err) => {
          return resJsonP(res, 400, false, err);
        });
    } catch (error) {
      return resJsonP(res, 500, false, error);
    }
  };
};

module.exports = {
  middlewareController
};
