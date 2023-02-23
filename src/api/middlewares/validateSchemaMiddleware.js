const Joi = require("joi");
const { resJsonP } = require("../../utils/helper");

const middlewareValidate = (property, schema, name) => {

    return (req, res, next) => {
      try {
      let schemas = require(`../router/${name}/${schema}`);

      for (let i = 0; i < property.length; i++) {
        let { error } = schemas[`${property[i]}Schema`].validate(
          req[property[i]],
          {
            abortEarly: false, // include all errors
            allowUnknown: true, // ignore unknown props
            stripUnknown: true, // remove unknown props
          }
        );
        if (error) {
          const { details } = error;

          const message = details.map((i) => i.message)[0];
          console.log(message);

          let msg = message.replace(/(?:[\'"])/g, "");
          // return res.send('Error')
         throw `${res.__(msg)}` //resJsonP(res, 422, false, `${res.__(msg)}`);
          // return;
        }
        if (!error) {
          next();

          }
        }
        console.log('veio')
      } catch (error) {
        console.log('caiu no error', error)
        
        return resJsonP(res, 422, false, error);
      }
    };

};

module.exports = {
  middlewareValidate,
};
