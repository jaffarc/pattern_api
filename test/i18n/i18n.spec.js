const i18n = require("i18n");
const chai = require("chai");
const { before } = require("mocha");
let expect = chai.expect;

describe("Locale switching should work on req and res", function () {
  let req = {},
    res = {};
  let __dirname = process.cwd();

  beforeEach(function () {
    i18n.configure({
      locales: ["en", "br"],
      defaultLocale: "en",
      directory: __dirname + "/src/locales",
    });
    i18n.init(req, res);
  });
  
  it("i18n setLocale BR", function (done) {
  
    req.setLocale("br");
    
    expect(req.__("ERRO_OBJECT_ID")).equal("O VALOR INFORMADO NÃO UM OBJECTID");
    expect(req.__("LAST_NAME")).equal("SOBRE NOME OBRIGATORIO");
    expect(req.__("ID_INVALIDO")).equal("ID É OBRIGATORIO");

    done();
  });

  it("i18n setLocale EN", function (done) {
  
    req.setLocale("en");
    
    expect(req.__("ERRO_OBJECT_ID")).equal("THE VALUE REPORTED IS NOT AN OBJECTID");
    expect(req.__("LAST_NAME")).equal("MANDATORY LAST NAME");
    expect(req.__("ID_INVALIDO")).equal("ID is REQUIRED");

    done();
  });
});
