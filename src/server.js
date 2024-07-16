"use strict";

const i18n = require("i18n");
const cors = require("cors");
const morgan = require("morgan");
const express = require("express");
const { json, urlencoded } = require("body-parser");


// const swaggerUi = require("swagger-ui-express");
require("dotenv").config({
  path: `.env.${process.env.NODE_ENV}`,
});

// const { buscarDados } = require("analiticlog");

const app = express();
i18n.configure({
  locales: ["br", "en"],
  defaultLocale: "br",
  autoReload: true,
  directory: __dirname + "/locales",
  register: "global",
});
app.disable("etag", "x-powered-by");
app.options("*", cors());
app.use(
  i18n.init,
  morgan(`${process.env.MORGAN}`),
  json({ limit: "500kb" }),
  urlencoded({ extended: true }),
);
const { validateType } = require('../src/api/middlewares/validateType')


// app.use(buscarDados);

// console.log(accessLogStream.token('combined'));
app.all("*",  (req, res, next) => {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Methods", "GET, POST, PUT, PATH");
  res.header("Access-Control-Allow-Headers", "Content-Type");
  res.header(
    "Access-Control-Allow-Headers",
    "Content-type, Accept, Authorization"
  );
  next();
});

// const RouteLog = require('../src/utils/routeLog');
// const route = {
//   key: 'my-route',
//   method: 'GET',
//   url: '/my-route',
//   controller: 'MyController',
//   action: 'index',
//   middlewares: [ 'auth', 'logger' ]
// };
// const log = new RouteLog(route);

// console.log(log);



app.use(require("./api/router/Router"));
app.use(validateType);

app.use((req, res, next) => {
  res.redirect('/api-docs');
  next()
})

module.exports = app;
