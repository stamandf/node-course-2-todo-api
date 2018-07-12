require('./config/config');

const _ = require('lodash');
const {ObjectID} = require('mongodb');
const express = require('express');
const bodyParser = require('body-parser');

let {mongoose} = require('./db/mongoose');
let {Todo} = require('./models/todo');
let {User} = require('./models/user');
let {authenticate} = require('./middleware/authenticate.js');

let app = express();
const port = process.env.PORT || 3000;

app.use(bodyParser.json());   //configure the middle ware
app.post('/todos', (req,res) => {  //create resources
  let todo = new Todo({
    text:req.body.text
  });
  todo.save().then((doc) => {
    res.send(doc);
  }, (e) => {
    res.status(400).send(e);
  });
});

app.get('/todos', (req,res) => {
  Todo.find().then((todos) => {
    res.send({todos});
  }, (e) => {
    res.status(400).send(e);
  });
});

//Create the endpoint for id.
//PUT
// app.put('todos/:id',(req,res) => {
//
// });
//GET /todos/1234455
app.get('/todos/:id', (req, res) => {
  // res.send(req.params);
  let id = req.params.id;
  // res.send('Hello!');
  if(!ObjectID.isValid(id)) {
    // console.log('Invalid ID.');
    return res.status(404).send('Invalid ID.')
  } else {
    Todo.findById(id).then((todo) => {
      if (!todo) {
        // console.log('Todo not found.');
        return res.status(404).send('Todo not found.')
      }
      // console.log('Todo By Id:', todo);
      res.send({todo}); //send the object containing the todo
    }).catch((e) => {
      res.status(400).send(e);
    });
  }
});

app.delete('/todos/:id', (req, res) => {
  // res.send(req.params);
  let id = req.params.id;
  // res.send('Hello!');
  if(!ObjectID.isValid(id)) {
    return res.status(404).send('Invalid ID.');
  } else {
    Todo.findByIdAndRemove(id).then((todo) => {
      if (!todo) {
        // console.log('doc not found.');
        return res.status(404).send('Todo not found.')
      }
      res.send({todo}); //send the object containing the todo
    }).catch((e) => {
      res.status(400).send(e);
    });
  }
});

app.patch('/todos/:id', (req,res) => {
  let id = req.params.id;
  let body = _.pick(req.body, ['text', 'completed']);

  if(!ObjectID.isValid(id)) {
    return res.status(404).send('Invalid ID.');
  }

  if(_.isBoolean(body.completed) && body.completed) {
    body.completedAt = new Date().getTime();
  } else {
     body.completed = false;
     body.completedAt = null;
  }

  Todo.findByIdAndUpdate(id, {$set:body},{new: true}).then((todo) => {
    if(!todo) {
      return res.status(404).send('ID not found.');
    }
    res.send({todo});
  }).catch((e) => {
    res.status(400).send();
  })
});
//Users

app.post('/users', (req,res) => {  //create resources
  let body = _.pick(req.body, ['email', 'password']);
  let user = new User(body);

  user.save().then(() => {
    return user.generateAuthToken();
    //res.send(user);
  }).then((token) => {
    res.header('x-auth', token).send(user);
  }).catch((e) => {
    res.status(400).send(e);
  })
});

// app.get('/users/me', authenticate, (req, res) => {
//   res.send(req.user);
// });

app.get('/users/me', authenticate, (req, res) => {
  res.send(req.user);
})
app.listen(port, () => {
  console.log(`Started up on port ${port}`);
});

module.exports = {app}
