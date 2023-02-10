const Joi = require("joi");
const { resJsonP } = require("../../utils/helper");

const middlewareValidate = (property, schema, name) => {
  // console.log("___", property);
  return (req, res, next) => {
    let schemas = require(`../router/${name}/${schema}`);

    for (let i = 0; i < property.length; i++) {
      // console.log("__", schemas[`${property[i]}Schema`]);

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

        const message = details.map((i) => i.message).join(",");
          return resJsonP(res, 422, false, message.replace(/(?:[\'"])/g, ""));
      }
    }
    next();
  };
};

module.exports = {
  middlewareValidate,
};
