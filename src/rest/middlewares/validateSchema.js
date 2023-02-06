const Joi = require("joi");
const { resJsonP } = require("../../utils/helper");

const middlewareValidate = (property, schema, name) => {
  console.log("___", property);
  return (req, res, next) => {
    let schemas = require(`../router/${name}/${schema}`);

    let { error } = schemas[`${schema}`].validate(req[property], {
      abortEarly: false,
      stripUnknown: true,
    });

    const valid = error == null;
    if (!valid) {
      const { details } = error;

      const message = details.map((i) => i.message).join(",");
      return resJsonP(res, 422, false, message.replace(/(?:[\'"])/g, ""));

    }
    next();
  };
};

module.exports = {
  middlewareValidate,
};
