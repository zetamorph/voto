const chai = require("chai");
const chaiHttp = require("chai-http");
const expect = chai.expect;
const helper = require("./specHelper");

chai.use(chaiHttp);

describe("Votes", () => {

  describe("POST Votes", () => {

    it("it creates a single new vote for an option of a poll", (done) => {
      done();
      
    });
  });
});