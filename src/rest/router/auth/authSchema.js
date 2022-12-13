const joi = require('joi');
// module.exports = () =>({
//     body:join.object().keys({
//         content: join.string().required(),
//         created_at: join.string().isoDate().required()
//     })
// })

module.exports = updateSchema = {
    path: 'body',
    schema: joi.object().keys({
        first_name: joi.string().required(),
        last_name: joi.string().required(),
    })
};
 
// headers : join.object().keys({

// })