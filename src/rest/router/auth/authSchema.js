const joi = require('joi');

const authSchema =  joi.object().keys({
 body:{
     last_name: joi.string().required(),
     first_name: joi.string().required(),
 }, 
 headers: {
    'x-app-id': joi.string().required(),
    'app-auth': joi.string().required()
}
});
 
module.exports = {authSchema} 
