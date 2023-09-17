
const resJsonP = (res, code, success, result) => res.status(code).json({ success: success, result: result });

const typeIN = Object.freeze({
    headers: "header",
    header: "header",
    body: "body",
    path: "path",
    param: "path"
  })

module.exports = {
    resJsonP,
    typeIN
}