const joi = require('joi');
// module.exports = () =>({
//     body:join.object().keys({
//         content: join.string().required(),
//         created_at: join.string().isoDate().required()
//     })
// })

module.exports = infoSchema = {
    path: 'param',
    schema: {
        id:joi.string().regex(/[0-9]{4}/).required()
    }
};

// headers : join.object().keys({

// })