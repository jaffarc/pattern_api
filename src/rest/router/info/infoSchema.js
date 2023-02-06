const Joi = require("joi");
const infoSchema = Joi.object({
  id: Joi.number()
}).required();

module.exports = { infoSchema };