const chai = require('chai');
const chaiHttp = require('chai-http');
const server = require('../index');
const User = require('../models/User');
const mongoose = require('mongoose');

chai.should();
chai.use(chaiHttp);

describe('Authentication Routes', () => {
  // Clean up the test database before running tests
  before(async () => {
    await User.deleteMany({});
  });

  // Test user registration
  describe('POST /api/auth/register', () => {
    it('should register a new user', (done) => {
      const user = {
        username: 'testuser',
        email: 'testuser@example.com',
        password: '123456',
      };
      chai
        .request(server)
        .post('/api/auth/register')
        .send(user)
        .end((err, res) => {
          res.should.have.status(200);
          res.body.should.have.property('token');
          done();
        });
    });

    it('should not register a user with an existing email', (done) => {
      const user = {
        username: 'testuser',
        email: 'testuser@example.com',
        password: '123456',
      };
      chai
        .request(server)
        .post('/api/auth/register')
        .send(user)
        .end((err, res) => {
          res.should.have.status(400);
          res.body.should.have.property('msg').eql('User already exists');
          done();
        });
    });
  });

  // Test user login
  describe('POST /api/auth/login', () => {
    it('should log in an existing user', (done) => {
      const user = {
        email: 'testuser@example.com',
        password: '123456',
      };
      chai
        .request(server)
        .post('/api/auth/login')
        .send(user)
        .end((err, res) => {
          res.should.have.status(200);
          res.body.should.have.property('token');
          done();
        });
    });

    it('should not log in with incorrect credentials', (done) => {
      const user = {
        email: 'testuser@example.com',
        password: 'wrongpassword',
      };
      chai
        .request(server)
        .post('/api/auth/login')
        .send(user)
        .end((err, res) => {
          res.should.have.status(400);
          res.body.should.have.property('msg').eql('Invalid credentials');
          done();
        });
    });
  });

  // Close database connection after tests
  after(async () => {
    mongoose.connection.close();
  });
});
