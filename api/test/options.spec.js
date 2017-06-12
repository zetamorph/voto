const chai = require("chai");
const chaiHttp = require("chai-http");
const expect = chai.expect;
const helper = require("./specHelper");

chai.use(chaiHttp);

describe("Options", () => {

  describe("POST Options", () => {

    it("it creates a single new option for a poll", (done) => {
      chai.request("localhost:8000")
        .post("/polls/1/options")
        .set("Content-Type", "application/json")
        .set("Auth", helper.token)
        .send({title: "miaumiaumiaumiau"})
        .end((err,res) => {
          expect(res).to.have.status(201);
          expect(res).to.be.json;
          expect(res.body).to.be.an("object");
          expect(res.body).to.include({ title: "miaumiaumiaumiau" });
        done();
      });
    });
  });
});