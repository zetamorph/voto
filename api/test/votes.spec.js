const chai = require("chai");
const chaiHttp = require("chai-http");
const expect = chai.expect;
const helper = require("./specHelper");

chai.use(chaiHttp);

describe("Votes", () => {

  describe("POST Votes", () => {

    it("it creates a single new vote for an option of a poll", (done) => {
      chai.request("localhost:8000")
        .post("/options/15/votes")
        .set("Content-Type", "application/json")
        .set("Auth", helper.token)
        .end((err,res) => {
            expect(res).to.have.status(201);
            expect(res).to.be.json;
            expect(res.body).to.be.an("object");
            expect(res.body).to.have.keys("userId", "optionId");
          done();
        });
    });

    it("it does not create a new vote if the user already voted on the poll", (done) => {
      chai.request("localhost:8000")
        .post("/options/1/votes")
        .set("Content-Type", "application/json")
        .set("Auth", helper.token)
        .end((err,res) => {
            expect(res).to.have.status(403);
            expect(res).to.be.json;
            expect(res.body).to.be.an("object");
            expect(res.body).to.include({err: "User already voted on this poll"});
          done();
        });
    });

  });
});