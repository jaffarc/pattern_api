const {findUserRepository} = require('../../repository/user')
const infoService = async ({body, params}) => {
    try {
        console.log('AAAAA', body, params);
      let a =  await findUserRepository();
        return  'online' 
    } catch (error) {
        throw error
    }
}

module.exports = {
    infoService
}