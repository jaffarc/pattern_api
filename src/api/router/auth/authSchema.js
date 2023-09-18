const joi = require("joi");

module.exports = {
  headers: joi.object().keys({
    objectId: joi.string(),  // .required().error((errors) => Object.assign(...errors, { message: "ID_INVALIDO" })),
    // 'app-auth': joi.string().required()
  }),

  body: joi.object().keys({
    last: joi
      .string()
      // .not("string")
      .required()
      .error((errors) => Object.assign(...errors, { message: "LAST_NAME" })),
    name: joi.string().not("string").required(),
    date: joi.string().optional(),
  }),
};
