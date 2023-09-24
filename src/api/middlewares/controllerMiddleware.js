const { resJsonP } = require("../../utils/helper");

const middlewareController = (path, serverName) => {
  let service = require(`../../service/${path}/${serverName}`);

  return (req, res) => {
    const serviceParams = {
      body: req.body,       // Passa o req.body como reqBody
      params: req.params    // Passa o req.params como reqParams
    };


    service[serverName](serviceParams) // Chama o serviço com os parâmetros
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