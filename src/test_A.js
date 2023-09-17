const Joi = require('joi')
const schema= {

  name: Joi.string().min(6).required(),
  email: Joi.string().min(6).email(),
  // password: Joi.string().min(6).required()
}
const validation = Joi.object().keys(schema).validate({name:'jaffar'});
console.log(validation )

  if(validation.error){
      res.status(400).send(validation.error.details[0].message);
      return ;
  }