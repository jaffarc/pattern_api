const joi = require("joi");
const infoSchema = joi.object().keys({
    id: joi.string().regex(/^(?=[a-f\d]{24}$)(\d+[a-f]|[a-f]+\d)/i),
}).required();

module.exports = { infoSchema };
//