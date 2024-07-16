const joi = require("joi");

module.exports = {
  body: joi.object().keys({
    last: joi
      .string()
      .required()
      .error((errors) => Object.assign(...errors, { message: "LAST_NAME" })),
    name: joi.string().required()
  }),
};
