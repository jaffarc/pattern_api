const {findUserRepository} = require('../../repository/user')
const infoService = async () => {
    try {
      let a =  await findUserRepository();
      console.log('AAAAA', a);
        return  'online' 
    } catch (error) {
        throw error
    }
}

module.exports = {
    infoService
}