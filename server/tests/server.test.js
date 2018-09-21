const expect = require('expect');
const request = require('supertest');
const {ObjectID} = require('mongodb');

const {app} = require('./../server');
const {Todo} = require('./../models/todo');
const {todos, populateTodos, users, populateUsers} = require('./seed/seed.js');
const {User} = require('./../models/user');

let _id = new ObjectID();
const id = 123;

beforeEach(populateUsers);
beforeEach(populateTodos);

describe('POST /todos',() => {
  it('should create a new todo', (done) => {
    let text = 'Test todo text';

    request(app)
    .post('/todos')
    .set('x-auth', users[0].tokens[0].token)
    .send({text})
    .expect(200)
    .expect((res) => {
      expect(res.body.text).toBe(text);
    })
    .end((err,res) => {
      if (err) {
        return done(err);
      }
      Todo.find({text}).then((todos) => {
        expect(todos.length).toBe(1);
        expect(todos[0].text).toBe(text);
        done();
      }).catch((e) => done(e));
    });
  });

  it('should not create a todo with invalid body data', (done) => {

      request(app)
      .post('/todos')
      .set('x-auth', users[0].tokens[0].token)
      .send({})
      .expect(400)
      .end((err,res) => {
        if(err) {
          return done(err);
        }
        Todo.find().then((todos) => {
          expect(todos.length).toBe(2);
          done();
        }).catch((e) => done(e));
      });
    });
})

describe('GET /todos', () => {
  it('should get all todos', (done) => {
    request(app)
      .get('/todos')
      .set('x-auth', users[0].tokens[0].token)
      .expect(200)
      .expect((res) => {
        expect(res.body.todos.length).toBe(1);
      })
      .end(done);
  });
});

describe('GET /todos/:id', () => {
  it('should return todo doc', (done) => {
    request(app)
    .get(`/todos/${todos[0]._id.toHexString()}`)
    .set('x-auth', users[0].tokens[0].token)
    .expect(200)
    .expect((res) => {
      expect(res.body.todo.text).toBe(todos[0].text);
    })
    .end(done);
  });

  it('should not return todo doc created by other user', (done) => {
    request(app)
    .get(`/todos/${todos[1]._id.toHexString()}`)
    .set('x-auth', users[0].tokens[0].token)
    .expect(404)
    .end(done);
  });

  it('should return 404 if todo not found', (done) => {
    let hexId = new ObjectID().toHexString();

    request(app)
    .get(`/todos/${hexId}`)
    .set('x-auth', users[0].tokens[0].token)
    .expect(404)
    .end(done);
  });

  it('should return error message if todo not found', (done) => {
    request(app)
    .get(`/todos/${todos[1]._id.toHexString()}`)
    .set('x-auth', users[0].tokens[0].token)
    .expect('Todo not found.')
    .end(done);
  });

  it('should return 404 for non-Object ids', (done) => {
    request(app)
    .get(`/todos/${id}`)
    .set('x-auth', users[0].tokens[0].token)
    .expect(404)
    .end(done);
  });

  it('should return a error message for non-Object ids', (done) => {
    request(app)
    .get(`/todos/${id}`)
    .set('x-auth', users[0].tokens[0].token)
    .expect('Invalid ID.')
    .end(done);
  });

});

  describe('DELETE /todos/:id', () => {
    it('should remove a todo doc', (done) => {
      var hexId = todos[1]._id.toHexString();

      request(app)
      .delete(`/todos/${hexId}`)
      .set('x-auth', users[1].tokens[0].token)
      .expect(200)
      .expect((res) => {
        expect(res.body.todo._id).toBe(hexId);
        })

      .end((err,res) => {
        if (err) {
          return done(err);
        }

        Todo.findById(hexId).then((todo) => {
          expect(todo).toBeFalsy(); //replaces toNotExist()
          done();
        }).catch((e) => done(e));
      });
    });

    it('should return 404 when todo does not exist', (done) => {
      let hexId = '6b340113a8fc334298156abc';
      request(app)
      .delete(`/todos/${hexId}`)
      .set('x-auth', users[1].tokens[0].token)
      .expect(404)
      .end(done);
    });

    it('should return error message when id does not exist', (done) => {
      let hexId = '6b340113a8fc334298156abc';
      request(app)
      .delete(`/todos/${hexId}`)
      .set('x-auth', users[1].tokens[0].token)
      .expect('Todo not found.')
      .end(done);
    });

    it('should return 404 for non-Object ids', (done) => {
      let invalidID = '5b340113a8fc334298156abc11'
      request(app)
      .delete(`/todos/${invalidID}`)
      .set('x-auth', users[1].tokens[0].token)
      .expect(404)
      .end(done);
    });

    it('should return an error message for non-Object ids', (done) => {
      let invalidID = '5b340113a8fc334298156abc11'
      request(app)
      .delete(`/todos/${invalidID}`)
      .set('x-auth', users[1].tokens[0].token)
      .expect('Invalid ID.')
      .end(done);
    });
  });

  describe('PATCH /todos/:id', () => {
    it('should update the todo', (done) => {
      let hexId = todos[0]._id.toHexString();
      let completed = true;
      let text = 'Completed second test todo';

      request(app)
      .patch(`/todos/${hexId}`)
      .set('x-auth', users[0].tokens[0].token)
      .send({completed, text})
      .expect(200)
      .expect((res) => {
        expect(res.body.todo.completed).toBe(completed);
        expect(res.body.todo.text).toBe(text);
        expect(typeof res.body.todo.completedAt).toBe('number');
      })
      .end(done);

    });

    it('should not update the todo created by other user', (done) => {
      var hexId = todos[1]._id.toHexString();
      var text = 'This should be the new text';

      request(app)
        .patch(`/todos/${hexId}`)
        .set('x-auth', users[0].tokens[0].token)
        .send({
          completed: true,
          text
        })
        .expect(404)
        .end(done);
    });

    it('should clear completedAt when not completed', (done) => {
      let hexId = todos[1]._id.toHexString();
      let completed = false;
      let text = "Not completed First Todo";

      request(app)
      .patch(`/todos/${hexId}`)
      .set('x-auth', users[1].tokens[0].token)
      .send({completed, text})
      .expect(200)
      .expect((res) => {
        expect(res.body.todo.completed).toBe(completed);
        expect(res.body.todo.text).toBe(text);
        expect(res.body.todo.completedAt).toBe(null);
        //expect(res.body.todo.completedAt).toBeA(number);
        //expect(2).toBeLessThan(3);
        //expect(2).toBeA('number');
      })
      .end(done);

    });
  });
  describe('GET /users/me', () => {
    it('should return user if authenticated', (done) => {
      request(app)
      .get('/users/me')
      .set('x-auth', users[0].tokens[0].token)
      .expect(200)
      .expect((res) => {
        expect(res.body._id).toBe(users[0]._id.toHexString());
        expect(res.body.email).toBe(users[0].email);
      })
      .end(done);
    });
    it('should return 401 if not authenticated', (done) => {
      request(app)
      .get('/users/me')
      .expect(401)
      .expect((res) => {
        expect(res.body).toEqual({});
      })
      .end(done);
    })
  });

  describe('POST /users', () => {
    it('should ceate user', (done) => {
      var email = 'example@example.com';
      var password = '123mnb!';

      request(app)
      .post('/users')
      .send({email, password})
      .expect(200)
      .expect((res) => {
        expect(res.headers['x-auth']).toBeTruthy();
        expect(res.body._id).toBeTruthy();
        expect(res.body.email).toBe(email);
      })
      .end((err) => {
        if(err) {
          return done(err);
        }

        User.findOne({email}).then((user) => {
          expect(user).toBeTruthy();
          expect(user.password).not.toBe(password);
          done();
        }).catch((e) => done(e));
      });
    });
    it('should return validation errors if email invalid', (done) =>{
      let invalidEmail = 'example@example.com';
      let password = '123mnb';
      request(app)
      .post('/users')
      .send({invalidEmail, password})
      .expect(400)
      .expect((res) => {
        expect(res.body.name).toBe('ValidationError');
      })
      .end(done);
    });
    it('should return validation errors if password invalid', (done) =>{
      let invalidEmail = 'exampleexample.com';
      let password = '1';
      request(app)
      .post('/users')
      .send({invalidEmail, password})
      .expect(400)
      .expect((res) => {
        expect(res.body.name).toBe('ValidationError');
      })
      .end(done);
    });

    it('should return validation errors if password missing', (done) =>{
      let invalidEmail = 'exampleexample.com';
      let password = '';
      request(app)
      .post('/users')
      .send({invalidEmail, password})
      .expect(400)
      .expect((res) => {
        expect(res.body.name).toBe('ValidationError');
      })
      .end(done);
    });

    it('should not create user if email already in use', (done) => {
      request(app)
      .post('/users')
      .send({
        email: users[0].email,
        password: 'Password123!'
      })
      .expect(400)
      .end(done);

    });
  });

  describe('POST /users/login', () => {
    it('should login user and return auth token', (done) => {
      request(app)
        .post('/users/login')
        .send({
          email: users[1].email,
          password: users[1].password
        })
        .expect(200)
        .expect((res) => {
          expect(res.headers['x-auth']).toBeTruthy();
        })
        .end((err, res) => {
          if (err) {
            return done(err);
          }
          User.findById(users[1]._id).then((user) => {
            expect(user.toObject().tokens[1]).toMatchObject({
              access: 'auth',
              token: res.headers['x-auth']
            });
            done();
          }).catch((e) => done(e));
        });
      })

      it('should reject invalid login', (done) => {
        request(app)
          .post('/users/login')
          .send({
            email: users[1].email,
            password: users[1].password + 'wrong'
          })
          .expect(400)
          .expect((res) => {
            expect(res.headers['x-auth']).toBeFalsy();
            expect(res.text).toEqual('Login or password incorrect.');
          })
          .end((err, res) => {
            if (err) {
              return done(err);
            }
            User.findById(users[1]._id).then((user) => {
              expect(user.tokens.length).toBe(1);
              done();
            }).catch((e) => done(e));
          });
        });
      });

      describe('DELETE /users/me/token', () => {
        it('should remove auth token on logout', (done) => {
          request(app)
            .delete('/users/me/token')
            .set('x-auth', users[0].tokens[0].token)
            .expect(200)
            .end((err, res) => {
              if (err) {
                return done(err);
              }
              User.findById(users[0]._id).then((user) => {
                expect(user.tokens.length).toBe(0);
                done();
              }).catch((e) => done(e));
            });
          });
          it('should reject remove auth token after logout', (done) => {
            request(app)
              .delete('/users/me/token')
              .set('x-auth', users[0].tokens[0].token)
              .expect(200)
              .end((err, res) => {
                if (err) {
                  return done(err);
                }

                User.findById(users[0]._id).then((user) => {
                  expect(user.tokens.length).toBe(0);
                  done();
                }).catch((e) => done(e));

                request(app)
                .delete('/users/me/token')
                .set('x-auth', users[0].tokens[0].token)
                .expect(401)
                .end((err, res) => {
                  if (err) {
                    return done(err);
                  }

                });

              });
          });

        });
