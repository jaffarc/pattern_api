const joi = require("joi");

module.exports = {
  headers: joi.object().keys({
    id: joi
      .string()
      .required()
      .regex(/^(?=[a-f\d]{24}$)(\d+[a-f]|[a-f]+\d)/i)
      .error((errors) =>
        Object.assign(...errors, { message: "ERRO_OBJECT_ID" })
      ),
  }),
  path: { 
    id: joi.number().min(1).required() 
   } 
};
