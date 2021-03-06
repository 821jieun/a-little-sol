'use strict';
const chai = require('chai');
const chaiHttp = require('chai-http');
const expect = chai.expect;
const faker = require('faker');
const mongoose = require('mongoose');

const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');

const {app, runServer, closeServer} = require('../server');
const {TEST_DATABASE_URL, JWT_SECRET} = require('../config');

const userModel = require('../backend/user/model.user');
const userController = require('../backend/user/controller.user');
const recController = require('../backend/drawing/controller.drawing');
const recModel = require('../backend/drawing/model.drawing');

chai.use(chaiHttp);

describe('User API', function() {
  this.timeout(15000);
  const username = "puffyCloud";
  const password = "raincloud";
  const firstName = "alto";
  const lastName = "stratus";

  before(function() {
    return runServer(TEST_DATABASE_URL);
  });

  after(function() {
    return closeServer();
  });

  beforeEach(function() {});

  afterEach(function() {
    userModel.remove({});
  });

  describe(`user/register`, function() {
    describe('POST', function() {
      it('Should reject users with missing username', function() {
        return chai
          .request(app)
          .post(`user/register`)
          .send({
            password,
            firstName,
            lastName
          })
          .then(() =>
            expect.fail(null, null, 'Request should not succeed')
          )
          .catch(err => {
            if (err instanceof chai.AssertionError) {
              throw err;
            }

            const res = err.response;

          });
      });
      it('should reject users with missing password', function() {
        return chai
          .request(app)
          .post(`user/register`)
          .send({
            username,
            firstName,
            lastName
          })
          .then(() =>
            expect.fail(null, null, 'Request should not succeed')
          )
          .catch(err => {
            if (err instanceof chai.AssertionError) {
              throw err;
            }
            const res = err.response;
          });
      });
      it('Should reject users with empty username', function() {
       return chai
         .request(app)
         .post(`user/register`)
         .send({
           username: '',
           password: password,
           firstName: firstName,
           lastName: lastName
         })
         .then(() =>
           expect.fail(null, null, 'Request should not succeed')
         )
         .catch(err => {
           if (err instanceof chai.AssertionError) {
             throw err;
           }

           const res = err.response;
         });
       });
       it('Should create a new user', function() {
         return chai
           .request(app)
           .post('/user/register')
           .send({
             username,
             password,
             firstName,
             lastName
           })
           .then(res => {
             expect(res).to.have.status(201);
             expect(res.body).to.be.an('object');

             expect(res.body.data.username).to.equal(username);
             expect(res.body.data.firstName).to.equal(firstName);
             expect(res.body.data.lastName).to.equal(lastName);
             return userModel.findOne({
               username
             });
           })
           .then(user => {
             expect(user).to.not.be.null;
             expect(user.firstName).to.equal(firstName);
             expect(user.lastName).to.equal(lastName);
             return user.validatePassword(password);
           })
           .then(passwordIsCorrect => {
             expect(passwordIsCorrect).to.be.true;
           });
       });
       //it
    })
  })
})
