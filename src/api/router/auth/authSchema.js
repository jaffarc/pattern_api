const joi = require("joi");

module.exports = {
  headers: joi.object().keys({
    id: joi.number().description('objectid do mongo').required().error((errors) => Object.assign(...errors, { message: "ID_INVALIDO" })),
    valor: joi.string().required()
  }),
  body: joi.object().keys({
    last: joi
      .string()
      .required()
      .error((errors) => Object.assign(...errors, { message: "LAST_NAME" })),
    name: joi.string().required(),
    date: joi.string().optional(),
  }),
};
