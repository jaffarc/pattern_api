const { resJsonP } = require('../../utils/helper')
const middlewareValidate = (...schemas) => {


    return validateSchema = (async (req, res, next) => {
        try {
            if (!schemas) {
                next();
            }
            for (let schemaItem of schemas) {
                let params
                const { headers, param, body } = schemaItem.validate;
                console.log(req.headers)
                params = (req.query || req.params) || JSON.parse(req.body)

                let { schema } = require(`../router/info/${param}`);
                let validation = schema.validate(params, {
                    abortEarly: false,
                });
                if (validation.error) {
                    let messages = validation.error.details.map((i) => i.message);
                    let errMessage = `Validation errors: ${messages.join(', ')}`;
                    throw {
                        status: 400,
                        message: errMessage,
                    };
                }
            }
            next();
        } catch (error) {
            console.log(error)
            return resJsonP(res, error.status, false, error.message);

        }
    });
};

module.exports = {
    middlewareValidate
}