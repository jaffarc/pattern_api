const { resJsonP } = require("../../utils/helper");
const middlewareController = (path, serverName) => {
  let service = require(`../../service/${path}/${serverName}`);
  return (req, res) => {
    service[serverName]()
      .then((result) => {
        return resJsonP(res, 200, true, result);
      })
      .catch((err) => {
        // console.log('caiu no controle');
        return resJsonP(res, 400, false, err);
      });
  };
};

module.exports = {
  middlewareController,
};
