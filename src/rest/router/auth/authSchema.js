const joi = require("joi");

const headersSchema = joi.object().keys({
    "id": joi.number().required(),
})

const bodySchema = joi.object().keys({
        last: joi.string().required(),
        name: joi.string().empty(''),
        date: joi.string().optional()
})


module.exports = {bodySchema, headersSchema};
