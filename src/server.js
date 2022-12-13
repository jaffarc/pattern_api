const express = require('express'),
  {json, urlencoded} = require('body-parser'),
  morgan = require('morgan'),
  i18n = require('i18n'),
  app = express();

  // console.log(`${__dirname}/.env.${process.env.NODE_ENV }`)
require('dotenv').config({
  path: `${__dirname}/.env.${process.env.NODE_ENV }`
});

app.set('port', (process.env.PORT || 3080));

app.use((req, res, next) => {
  const _send = res.send;
  let sent = false;
  res.send = function (data) {
    if (sent) return;
    _send.bind(res)(data);
    sent = true;
  };
  res.setHeader('Content-Security-Policy', 'script-src "self" https://apis.google.com');
  next();
});

app.all('*', (req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*');
  //res.header('Access-Control-Allow-Origin', req.headers.host);
  res.header('Access-Control-Allow-Methods', 'GET, POST');
  res.header('Access-Control-Allow-Headers', 'Content-Type');
  res.header('Access-Control-Allow-Headers', 'Content-type, Accept, Authorization');
  //console.log('IP: ', req.connection.remoteAddress);
  next();
});

i18n.configure({
  locales: ['br', 'en'],
  directory: __dirname + '/config/locales',
  register: global,
});

app.disable('x-powered-by');
app.use(
  i18n.init,
  morgan('dev'),
  json({ limit: '1000MB', extended: true }),
  urlencoded({ limit: '1000MB', extended: true })
);

app.use(require('./rest/router/registerRouter'));

// console.log(process.env.DB_HOST);

module.exports = app;