const Joi = require("joi");
// const i18n = require('i18n');
const { resJsonP } = require("../../utils/helper");

const middlewareValidate = (property, schema, name) => {
  try {
    // console.log("___", property);
    return (req, res, next) => {
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
          console.log(JSON.stringify(message));
          let msg = message.replace(/(?:[\'"])/g, "")
          return resJsonP(res, 422, false, `${res.__(msg)}` );  
          //`${i18n.__('EXPI_ITEM_CART')}`
        }
      }
      next();
    };
  } catch (error) {
    return resJsonP(res, 422, false, error);
  }
};

module.exports = {
  middlewareValidate,
};
