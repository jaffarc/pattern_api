
const { Router } = require('express');
const fs = require('fs');
const router = Router();
const path = require('path');
const {middlewareValidate} = require('../middlewares/validateSchema')

let routers = [];

function* routerSync(dir) {
    const files = fs.readdirSync(dir, { withFileTypes: true });
    for (const file of files) {
        if (file.isDirectory()) {
            yield* routerSync(path.join(dir, file.name));
        }
        if (/((?:([R-r]outer)))/g.test(file.name) && file.name !== path.basename(__filename)) {
            if (!routers.includes(`${dir}/${file.name}`)) {
                yield routers.push(...require(`${dir}/${file.name}`))
            }
        }
    }
}



for (const filePath of routerSync(`${__dirname}/`)) 


for (let i = 0; i < routers.length; ++i) {
    let validates = [];
    try {
        const { method, path, validate, controller, name } = routers[i];

        router[method](path,   middlewareValidate({validate, name}), require(`./${name}/${controller}`))
    } catch (error) {
        const pf = String(error).match(/(\/.*?\/)((?:[^\/]|\\\/)+?)(?:(?<!\\)\s|$)/)
        console.error(`Path ${pf[1]} or file ${pf[2]} not found.`)
    }
}

router.use((req, res, next) => {
    if (/\.[ico]+$/i.test(req.originalUrl)) {
        return res.status(200).jsonp();
    }

    if (/\.[0-9a-zA-Z]+$/i.test(req.originalUrl) || /(\.[0-9a-z-A-Z]*)/im.test(req.originalUrl)) {
        return res.status(401).jsonp({ code: 'unAuthorized', message: 'Unauthorized referral acess' });
    }
    res.status(401)
    return next(JSON.stringify({ code: 401, message: 'Unauthorized referral acess' }));

})


module.exports = router;


