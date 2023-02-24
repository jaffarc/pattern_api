function middlewareValidate(property, schema, name) {
  return (req, res, next) => {
    try {
      // code block to be executed

      let schemas = require(`../router/${name}/${schema}`);
      let responseSent = false; // variável de controle
      let msgErro;
      for (let i = 0; i < property.length; i++) {
        let { error } = schemas[`${property[i]}Schema`].validate(
          req[property[i]],
          {
            abortEarly: false,
            allowUnknown: true,
            stripUnknown: true,
          }
        );
        // console.log("Error", property.length);
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
