
// conso


// const { Router } = require('express');
// const api = Router();

// api
//     .use('/', require('./info/'))

//     .use((req, res, next) => {
//         if (/\.[ico]+$/i.test(req.originalUrl)) {
//             return res.status(200).jsonp();
//         }

//         if (/\.[0-9a-zA-Z]+$/i.test(req.originalUrl) || /(\.[0-9a-z-A-Z]*)/im.test(req.originalUrl)) {
//             return res.status(500).jsonp({ code: 'unAuthorized', message: 'Unauthorized referral acess' });
//         }
//         res.status(401)
//         return next(JSON.stringify({ code: 401, message: 'Unauthorized referral acess' }));

//     })


// module.exports = api;