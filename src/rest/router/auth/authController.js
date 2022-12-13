const { resJsonP } = require('../../../utils/helper')
const { authService } = require('../../../service/auth/authService')
const authController = (req, res, next) => {
    authService().then(( result ) => {
        resJsonP(res, 200, true, result)
    }).catch(err => {
        resJsonP(res, 400, false, err)
    })
}

module.exports = authController;