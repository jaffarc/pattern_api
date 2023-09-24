const { typeIN } = require('../../utils/helper')
function middlewareValidate(property, schema, name) {
  let responseSent = false;
  return async (req, res, next) => {
    try {
      const _validationOptions = {
        abortEarly: false,
        allowUnknown: true,
        stripUnknown: true,
        convert: true,
      };
      let schemas = require(`../router/${name}/${schema}`);

      for (let i = 0; i < property.length; i++) {
        let vt = typeIN[property[i]];

        console.log(vt)
        if (schemas[property[i]] && req[property[i]]) {

          console.log('++++', property[i], schemas[vt], req[vt])

          let { error } = await schemas[property[i]].validate(
            req[property[i]],
            _validationOptions
          );
          console.log("EROO", error);
          if (error) {
            const { details } = error;
            const message = details.map((i) => i.message)[0];
            msgErro = message.replace(/(?:[\'"])/g, "");
            if (property.length >= i) {
              responseSent = true; // resposta enviada
              break;
            }
          }
        }
      }
      if (responseSent) {
        throw { message: `${res.__(msgErro)}` };
      }

      next();
    } catch (err) {
      next(err);
    }
  };
}

module.exports = {
  middlewareValidate,
};
