/* eslint-disable no-undef */
// process.env.NODE_ENV = !process.env.NODE_ENV ? 'test' : process.env.NODE_ENV;

const chai = require("chai");
const app = require("../../../src/server");
request = require("supertest");
// clearDB = require('../cleardb');
let expect = chai.expect;

describe("ROUTER ", () => {
  describe("Auth", () => {
    it("Sem Id no headers", (done) => {
      request(app)
        .post("/auth")
        .set("Origin", "http://localhost")
        .set("content-type", "application/json; charset=utf-8")
        .expect(422)
        .end((err, res) => {
          if (err) return done(err);
          console.log(res.body);
          expect(res.body.success).equal(false);
          expect(res.body.message).equal("ID É OBRIGATORIO");
          done();
        });
    });

    it("Com Id no headers sem body", (done) => {
      request(app)
        .post("/auth")
        .set("Origin", "http://localhost")
        .set("content-type", "application/json; charset=utf-8")
        .set("id", 73287)
        .expect(422)
        .end((err, res) => {
          if (err) return done(err);
          console.log(res.body);
          expect(res.body.success).equal(false);
          expect(res.body.message).equal("SOBRE NOME OBRIGATORIO");
          done();
        });
    });

    it("Com Id no headers e body", (done) => {
      request(app)
        .post("/auth")
        .set("Origin", "http://localhost")
        .set("content-type", "application/json; charset=utf-8")
        .set("id", 73287)
        .expect(200)
        .send({
          name: "nome",
          last: "sobrenome",
          date: "2023-02-22",
        })
        .end((err, res) => {
          if (err) return done(err);
          // console.log(res.body);
          expect(res.body.success).equal(true);
          expect(res.body.result).has.haveOwnProperty("date");
          expect(res.body.result).has.haveOwnProperty("token");
          done();
        });
    });
  });
});
