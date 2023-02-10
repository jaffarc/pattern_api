const fs = require("fs");
const path = require("path");
const { Router } = require("express");
const router = Router();
const { middlewareValidate } = require("../middlewares/validateSchema");


function* routerSync(dir) {
  const files = fs.readdirSync(dir, { withFileTypes: true });

  for (const file of files) {
    if (file.isDirectory()) {
      yield* routerSync(path.join(dir, file.name));
    }
    if (
      /((?:([R-r]outer)))/g.test(file.name) &&
      file.name !== path.basename(__filename)
    ) {
      yield `${dir}/${file.name}`;
    }
  }
}

for (const filePath of routerSync(`${__dirname}/`)) {
  try {
    const { name, method, path, validate, controller, argument, status } =
      require(filePath)[0];
    if (status) {
      router[method](
        argument,
        middlewareValidate(path, validate, name),
        require(`./${name}/${controller}`)
      );
    }
  } catch (error) {
    const pf = String(error).match(
      /(\/.*?\/)((?:[^\/]|\\\/)+?)(?:(?<!\\)\s|$)/
    );
    console.error(`Path ${pf[1]} or file ${pf[2]} not found.`);
  }
}

router.use((req, res, next) => {
  if (req.originalUrl && req.originalUrl.split("/").pop() === "favicon.ico") {
    return res.sendStatus(204);
  }

  if (
    /\.[0-9a-zA-Z]+$/i.test(req.originalUrl) ||
    /(\.[0-9a-z-A-Z]*)/im.test(req.originalUrl)
  ) {
    return res
      .status(401)
      .jsonp({ code: "unAuthorized", message: "Unauthorized referral acess" });
  }

  return next(
    JSON.stringify({ code: 401, message: "Unauthorized referral acess" })
  );
});



module.exports = router;
