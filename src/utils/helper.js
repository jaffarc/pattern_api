
const resJsonP = (res, code, success, result) => res.status(code).json({ success: success, result: result });

module.exports = {
    resJsonP
}