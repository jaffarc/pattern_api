const middlewareController = (path, serverName) => {
  const { resJsonP } = require("../../utils/helper");
  let service = require(`../../service/${path}/${serverName}`);
  return (req, res) => {
    service[serverName]()
      .then((result) => {
        return resJsonP(res, 200, true, result);
      })
      .catch((err) => {
        return resJsonP(res, 400, false, err);
      });
  };
};

module.exports = {
  middlewareController,
};
