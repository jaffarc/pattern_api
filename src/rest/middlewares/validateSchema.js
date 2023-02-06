const Joi = require("joi");
const { resJsonP } = require("../../utils/helper");

const middlewareValidate = (property, schema, name) => {
  console.log("___", property);
  return (req, res, next) => {
    let schemas = require(`../router/${name}/${schema}`);

    let { error } = schemas[`${schema}`].validate(req[property], {
      abortEarly: false,
      stripUnknown: true,
    });

    const valid = error == null;
    if (!valid) {
      const { details } = error;

      const message = details.map((i) => i.message).join(",");
      return resJsonP(res, 422, false, message.replace(/(?:[\'"])/g, ""));

    }
    next();
  };
};

module.exports = {
  middlewareValidate,
};

// const middlewareValidate = (...schemas) => {

//     return validateSchema = (async (req, res, next) => {
//         try {
//             if (!schemas) {
//                 next();
//             }
//             for (let schemaItem of schemas) {
//                 let  schema  = require(`../router/info/${schemaItem.validate}`);
//                schema.validate(req[schemaItem.path])
//                 console.log('aaaa',req[schemaItem.path], schema)
//                 console.log()
//             }
//             // console.log(validate(req[property], ))

//             // for (let schemaItem of schemas) {
//             //     let params
//             //     const { headers, param, body } = schemaItem.validate;
//             //     console.log(req.headers)
//             //     params = (req.query || req.params) || JSON.parse(req.body)

//             //     let { schema } = require(`../router/info/${param}`);
//             //     let validation = schema.validate(params, {
//             //         abortEarly: false,
//             //     });
//             //     if (validation.error) {
//             //         let messages = validation.error.details.map((i) => i.message);
//             //         let errMessage = `Validation errors: ${messages.join(', ')}`;
//             //         throw {
//             //             status: 400,
//             //             message: errMessage,
//             //         };
//             //     }
//             // }
//             next();
//         } catch (error) {
//             console.log(error)
//             return resJsonP(res, error.status, false, error.message);

//         }
//     });
// };

// module.exports = {
//     middlewareValidate
// }
