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
// app.use(buscarDados);

// console.log(accessLogStream.token('combined'));
app.all("*", (req, res, next) => {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Methods", "GET, POST");
  res.header("Access-Control-Allow-Headers", "Content-Type");
  res.header(
    "Access-Control-Allow-Headers",
    "Content-type, Accept, Authorization"
  );

  next();
});

/**
 * @description Se os param enviado ocorrer um erro. interno no middleware JSON mal formado
 */
app.use((err, req, res, next) => {
  if (
    err instanceof SyntaxError &&
    err.status >= 400 &&
    err.status < 500 &&
    err.message.indexOf("JSON") !== -1
  ) {
    return res
      .status(500)
      .jsonp({ sucess: false, result: "Object json invalid" });
  }
  next();
});

app.use(require("./api/router/registerRouter"));

module.exports = app;
