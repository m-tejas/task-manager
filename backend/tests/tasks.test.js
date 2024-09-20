const chai = require('chai');
const chaiHttp = require('chai-http');
const server = require('../index');
const Task = require('../models/Task');
const User = require('../models/User');
const mongoose = require('mongoose');

chai.should();
chai.use(chaiHttp);

let token = ''; // Store JWT token for authenticated requests

describe('Task Routes', () => {
  before(async () => {
    // Clean up the test database
    await User.deleteMany({});
    await Task.deleteMany({});

    // Register and login a user to get token
    const user = {
      username: 'testuser',
      email: 'testuser@example.com',
      password: '123456',
    };
    const res = await chai
      .request(server)
      .post('/api/auth/register')
      .send(user);
    token = res.body.token; // Save token for authenticated requests
  });

  // Test task creation
  describe('POST /api/tasks', () => {
    it('should create a task', (done) => {
      const task = {
        title: 'Test Task',
        description: 'This is a test task',
      };
      chai
        .request(server)
        .post('/api/tasks')
        .set('x-auth-token', token) // Pass JWT token for authenticated requests
        .send(task)
        .end((err, res) => {
          res.should.have.status(200);
          res.body.should.have.property('title').eql('Test Task');
          done();
        });
    });

    it('should not create a task without a title', (done) => {
      const task = { description: 'Missing title' };
      chai
        .request(server)
        .post('/api/tasks')
        .set('x-auth-token', token)
        .send(task)
        .end((err, res) => {
          res.should.have.status(400);
          res.body.errors[0].msg.should.eql('Title is required');
          done();
        });
    });
  });

  // Test task retrieval
  describe('GET /api/tasks', () => {
    it('should retrieve all tasks for the user', (done) => {
      chai
        .request(server)
        .get('/api/tasks')
        .set('x-auth-token', token)
        .end((err, res) => {
          res.should.have.status(200);
          res.body.should.be.a('array');
          res.body.length.should.be.eql(1);
          done();
        });
    });
  });

  // Test task update
  describe('PUT /api/tasks/:id', () => {
    let taskId = '';
    before(async () => {
      const task = new Task({
        title: 'Update Test Task',
        user: mongoose.Types.ObjectId(),
      });
      const savedTask = await task.save();
      taskId = savedTask._id;
    });

    it('should update a task', (done) => {
      const updatedTask = { title: 'Updated Task' };
      chai
        .request(server)
        .put(`/api/tasks/${taskId}`)
        .set('x-auth-token', token)
        .send(updatedTask)
        .end((err, res) => {
          res.should.have.status(200);
          res.body.should.have.property('title').eql('Updated Task');
          done();
        });
    });
  });

  // Test task deletion
  describe('DELETE /api/tasks/:id', () => {
    let taskId = '';
    before(async () => {
      const task = new Task({
        title: 'Delete Test Task',
        user: mongoose.Types.ObjectId(),
      });
      const savedTask = await task.save();
      taskId = savedTask._id;
    });

    it('should delete a task', (done) => {
      chai
        .request(server)
        .delete(`/api/tasks/${taskId}`)
        .set('x-auth-token', token)
        .end((err, res) => {
          res.should.have.status(200);
          res.body.should.have.property('msg').eql('Task removed');
          done();
        });
    });
  });

  after(async () => {
    mongoose.connection.close();
  });
});
