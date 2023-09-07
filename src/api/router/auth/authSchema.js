const joi = require("joi");

module.exports = {
  headers: {
    objectID: joi
      .number()
      .required()
      .error((errors) => Object.assign(...errors, { message: "ID_INVALIDO" })),
      'app-auth': joi.string().required()
  },

  body: joi.object().keys({
    last: joi
      .string()
      .not("string")
      .required()
      .error((errors) => Object.assign(...errors, { message: "LAST_NAME" })),
    name: joi.string().not("string").required(),
    date: joi.string().optional(),
  }),
};
