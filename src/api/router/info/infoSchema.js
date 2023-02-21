const joi = require("joi");

const paramsSchema = joi
  .object()
  .keys({
    id: joi.string().regex(/^(?=[a-f\d]{24}$)(\d+[a-f]|[a-f]+\d)/i).required()
  })
  .required()
  .error((errors) =>
    Object.assign(...errors, { message: 'ERRO_OBJECT_ID' })
  );

module.exports = { paramsSchema };
