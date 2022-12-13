const { resJsonP } = require('../../../utils/helper')
const { infoService } = require('../../../service/info/infoService')
const infoController = (req, res, next) => {
    infoService().then(({ result }) => {
        resJsonP(res, 200, true, result)
    }).catch(err => {
        resJsonP(res, 400, false, err)
    })
}

module.exports = infoController;