const chai = require("chai");
const chaiHttp = require("chai-http");
const expect = chai.expect;
const helper = require("./specHelper");

chai.use(chaiHttp);

describe("Polls", (done) => {

  describe("GET Polls", () => {

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
          expect(res.body).to.be.an("object");
          expect(res.body).to.have.keys("id", "title", "user", "options", "votes");
        done();
      });
    });

  });

  describe("POST Polls", () => {

    it("it should create a new poll", (done) => {
      chai.request("localhost:8000")
        .post("/polls")
        .set("Content-Type", "application/json")
        .set("Auth", helper.token)
        .send({
          title: "What is your favorite book?"
        })
        .end((err, res) => {
          expect(res).to.have.status(201);
          expect(res).to.be.json;
          expect(res.body).to.have.keys("id", "title");
          expect(res.body).to.include({title: "What is your favorite book?"});
        done();
      });
    });
  });
});
