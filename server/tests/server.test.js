const expect = require('expect');
const request = require('supertest');
const {ObjectID} = require('mongodb');

const {app} = require('./../server');
const {Todo} = require('./../models/todo');

let _id = new ObjectID();
const id = 123;

const todos = [{
  _id: new ObjectID(),
  text: 'First test todo',
  completed: true,
  completedAt: 1530220329490
},{
  _id: new ObjectID(),
  text: 'Second test todo'
}];
beforeEach((done) => {
  Todo.remove({}).then(() => {
    return Todo.insertMany(todos);
  }).then(() => done());
});

describe('POST /todos',() => {
  it('should create a new todo', (done) => {
    let text = 'Test todo text';

    request(app)
    .post('/todos')
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
      .expect(200)
      .expect((res) => {
        expect(res.body.todos.length).toBe(2);
      })
      .end(done);
  });
});

describe('GET /todos/:id', () => {
  it('should return todo doc', (done) => {
    request(app)
    .get(`/todos/${todos[0]._id.toHexString()}`)
    .expect(200)
    .expect((res) => {
      expect(res.body.todo.text).toBe(todos[0].text);
    })
    .end(done);
  });

  it('should return 404 when id not found', (done) => {
    request(app)
    .get(`/todos/${_id.toHexString()}`)
    .expect(404)
    .end(done);
  });

  it('should return error message when id not found', (done) => {
    request(app)
    .get(`/todos/${_id.toHexString()}`)
    .expect('Todo not found.', done);
  });

  it('should return 404 for non-Object ids', (done) => {
    request(app)
    .get(`/todos/${id}`)
    .expect(404)
    .end(done);
  });

  it('should return a error message for non-Object ids', (done) => {
    request(app)
    .get(`/todos/${id}`)
    .expect('Invalid ID.')
    .end(done);
  });
});

  describe('DELETE /todos/:id', () => {
    it('should remove a todo doc', (done) => {
      let hexId = todos[0]._id.toHexString();
      request(app)
      .delete(`/todos/${hexId}`)
      .expect(200)
      .expect((res) => {
        expect(res.body.todo._id).toBe(hexId);
        })
      .end((err,res) => {
        if (err) {
          return done(err);
        }
        Todo.findById(hexId).then((todo) => {
          expect(todo).toBeFalsy();
          done();
        }).catch((e) => done(e));
       });
    });

    it('should return 404 when todo does not exist', (done) => {
      let hexId = '6b340113a8fc334298156abc';
      request(app)
      .delete(`/todos/${hexId}`)
      .expect(404)
      .end(done);
    });

    it('should return error message when id does not exist', (done) => {
      let hexId = '6b340113a8fc334298156abc';
      request(app)
      .delete(`/todos/${hexId}`)
      .expect('Todo not found.', done);
    });

    it('should return 404 for non-Object ids', (done) => {
      let invalidID = '5b340113a8fc334298156abc11'
      request(app)
      .delete(`/todos/${invalidID}`)
      .expect(404)
      .end(done);
    });

    it('should return an error message for non-Object ids', (done) => {
      let invalidID = '5b340113a8fc334298156abc11'
      request(app)
      .delete(`/todos/${invalidID}`)
      .expect('Invalid ID.')
      .end(done);
    });
  });

  describe('PATCH /todos/:id', () => {
    it('should update the todo', (done) => {
      let hexId = todos[1]._id.toHexString();
      let completed = true;
      let text = 'Completed second test todo';
      request(app)
      .patch(`/todos/${hexId}`)
      .send({completed, text})
      .expect(200)
      .expect((res) => {
        expect(res.body.todo.completed).toBe(completed);
        expect(res.body.todo.text).toBe(text);
        expect(typeof res.body.todo.completedAt).toBe('number');
      })
      .end(done);
    });

    it('should clear completedAt when not completed', (done) => {
      let hexId = todos[0]._id.toHexString();
      let completed = false;
      let text = "Not completed First Todo";
      request(app)
      .patch(`/todos/${hexId}`)
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
