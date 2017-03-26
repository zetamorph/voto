process.env.NODE_ENV = "test";

const db = require("../db.js");
const seed= require("../seed");
const chai = require("chai");
const chaiHttp = require("chai-http");
const server = require("../server.js");
let should = chai.should();

chai.use(chaiHttp);

describe("Polls", () => {
  beforeEach((done) => {
    // empty the db
    db.sequelize.sync({force:true}).then(() => {
      done();
    });
  });
  describe("GET /api/polls", () => {
    it("it should GET all the polls", (done) => {
      chai.request(server)
        .get("/api/polls")
        .end((err,res) => {
          res.should.have.status(200);
          res.body.should.be.a("array");
          res.body.length.should.be.eql(0);
          done();
        });
    });
  });
});