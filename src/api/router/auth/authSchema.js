const joi = require("joi");

const headersSchema = joi.object().keys({
  id: joi.number().required().error((errors) => Object.assign(...errors, { message: "ID_INVALIDO" })),
});

const bodySchema = joi.object().keys({
  last: joi
    .string()
    .required()
    .error((errors) => Object.assign(...errors, { message: "LAST_NAME" })),
  name: joi.string().empty(""),
  date: joi.string().optional(),
});

module.exports = { bodySchema, headersSchema };
