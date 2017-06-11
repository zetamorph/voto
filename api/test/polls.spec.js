process.env.NODE_ENV = "test";

const chai = require("chai");
const chaiHttp = require("chai-http");
const expect = chai.expect;
const server = require("./../src/server.js");
const app = server.listen;

chai.use(chaiHttp);

  before("make sure the db is seeded and the server is listening", (done) => {
    server.init(() => {
      done();
    });
  });

  describe("GET", () => {

    it("it should return a list of polls", (done) => {
      chai.request("localhost:8000")
        .get("/polls")
        .set("Content-Type", "application/json")
      .end((err,res) => {
          expect(res).to.have.status(200);
          expect(res).to.be.json;
          expect(res.body).to.be.an("array");
          expect(res.body).to.have.length(10);
          
        done();
      });
    });

    it("it should return a single poll and all its options and respective votes", (done) => {
      chai.request("localhost:8000")
        .get("/polls/1")
        .set("Content-Type", "application/json")
      .end((err,res) => {
          expect(res).to.have.status(200);
          expect(res).to.be.json;
          expect(res.body).to.have.property("user");
          expect(res.body).to.have.property("options");
          expect(res.body).to.have.property("votes");
        done();
    });

    });

  });

