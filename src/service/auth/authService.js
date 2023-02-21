
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
const authService = async () => {
    try {
        return {
            date: new Date(),
            token: 'fdsafaskfjksajasjlljf'
        } 

    } catch (error) {
        throw error
    }
}

module.exports = {
    authService
}