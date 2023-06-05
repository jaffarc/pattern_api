const { User } = require('../schema/userSchema');
  // { ObjectIdCast } = require('../../../utils/');

/**
 * @description Cria um novo usuário
 *
 * @requires module: service/auth.createUserService
 * @requires module: service/auth.loginOrcreateSocialService
 * @function createUserRepository
 * @param {Object} user - Objeto contendo os dados do usuário
 * @throws Não emite erro, apenas cria um log com o seu conteúdo
 */
exports.findUserRepository = user => {
  try {
    return User.findOne(user).lean();
  } catch (error) {
    console.log('\x1b[31m%s\x1b[0m', 'Erro in createUserRepository', error);
  }
};
