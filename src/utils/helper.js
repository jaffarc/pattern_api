
const resJsonP = (res, code, success, result) => res.status(code).jsonp({ success: success, result: result });

module.exports = {
    resJsonP
}