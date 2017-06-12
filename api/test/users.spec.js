const chai = require("chai");
const chaiHttp = require("chai-http");
const db = require("./../src/db/db");
const expect = chai.expect;
const helper = require("./specHelper");

chai.use(chaiHttp);

describe("Users", () => {

  describe("Login users", () => {
    it("it logs a user in and returns an Auth header", (done) => {
      chai.request("localhost:8000")
        .post("/users/login")
        .set("Content-Type", "application/json")
        .set("Auth", helper.token)
        .send({ email: "markus@markus.de", password: "markus" })
        .end((err,res) => {
            expect(res).to.have.status(200);
            expect(res).to.be.json;
            expect(res).to.have.header("Auth");
            expect(res.body).to.be.an("object");
            expect(res.body).to.have.keys("id", "email", "username");
          done();
        });
    });
  });

  describe("Signup users", () => {
    it("it creates a new user", (done) => {
      chai.request("localhost:8000")
        .post("/users")
        .set("Content-Type", "application/json")
        .send({ 
          username: "FranzJosef", 
          email: "franz@josef.de", 
          password: "josef-franz" 
        })
        .end((err,res) => {
            expect(res).to.have.status(201);
            expect(res).to.be.json;
            expect(res.body).to.be.an("object");
            expect(res.body).to.not.have.property("password");
          done();
        });
    });
  });

  describe("Logout users", () => {

    var token, user;

    before("log in a user", (done) => {
      db.user.authenticate({
        email: "claudius@claudius.de",
        password: "claudius"
      })
      .then((userInstance) => {
        user = userInstance;
        return db.token.create({
          token: userInstance.generateToken("authentication")
        });
      })
      .then((tokenInstance) => {
        token = tokenInstance.get("token");
        done();
      })
      .catch((err) => {
        if(err) throw err;
      });
    });

    it("it logs out a logged in user", (done) => {
      chai.request("localhost:8000")
        .delete("/users/logout")
        .set("Content-Type", "application/json")
        .set("Auth", token)
        .end((err,res) => {
            expect(res).to.have.status(204);
          done();
        });
    });
  });

/*

  describe("DELETE Users", () => {
    
    let token;

    before("create a new user to delete", (done) => {
      
      db.user.create({
        username: "JosefFranz",
        email: "franz@franz.de",
        password: "franzjosef"
      })
      .then((newUser) => {
        return db.user.authenticate({
          email: "franz@franz.de",
          password: "franzjosef"
        });
      })
      .then((userInstance) => {
        return db.token.create({
          token: userInstance.generateToken("authentication")
        });
      })
      .then((tokenInstance) => {
        token = tokenInstance.get("token");
        done();
      })
      .catch((err) => {
        if(err) throw err;
      });
    });
    
    it("deletes a logged in user", (done) => {
      console.log(token);
      chai.request("localhost:8000")
        .delete("/users")
        .set("Content-Type", "application/json")
        .set("Auth", token)
        .end((err,res) => {
            expect(res).to.have.status(204);
            expect(res).to.be.json;
            expect(res.body).to.be.an("object");
            expect(res.body).to.be.empty;
          done();
        });
    })
    
  });

  */

});