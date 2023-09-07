
/**
 * @description description
 * @author Jaffar Cardoso <http://gitlab.com/jaffarc>
 *
 * @requires module: router/origem/collection/action/perfil
 *
 * @function authService
 * @param {Object} paramName - paramDescription
 * @returns {Promise.<pending>} Resultado da operação
 * @throws Emite erro e cria um log com o seu conteúdo
*/
const authService = async ({body}) => {
    try {
        console.log('AAAAA', body);
        return {
            date: new Date(),
            token: 'fdsafaskfjksajasjlljf'
        } 
        // throw 'informações';

    } catch (error) {
        throw error
    }
}

module.exports = {
    authService
}