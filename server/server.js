require('./config/config');

const _ = require('lodash');
const {ObjectID} = require('mongodb');
const express = require('express');
const bodyParser = require('body-parser');
const bcrypt = require('bcryptjs');

let {mongoose} = require('./db/mongoose');
let {Todo} = require('./models/todo');
let {User} = require('./models/user');
let {authenticate} = require('./middleware/authenticate.js');

let app = express();
const port = process.env.PORT || 3000;

app.use(bodyParser.json());   //configure the middle ware

app.post('/todos', authenticate, (req,res) => {  //create resources
  let todo = new Todo({
    text: req.body.text,
    _creator: req.user._id
  });
  todo.save().then((doc) => {
    res.send(doc);
  }, (e) => {
    res.status(400).send(e);
  });
});

app.get('/todos', authenticate, (req,res) => {
  Todo.find({
    _creator: req.user._id
  }).then((todos) => {
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
app.get('/todos/:id', authenticate, (req, res) => {  //todo's id
  let id = req.params.id;
  // res.send('Hello!');
  if(!ObjectID.isValid(id)) {
    // console.log('Invalid ID.');
    return res.status(404).send('Invalid ID.')
  } else {
    Todo.findOne({
      _id:id,
      _creator: req.user._id
    }).then((todo) => {
      if (!todo) {
        return res.status(404).send('Todo not found.')
      }
      res.send({todo}); //send the object containing the todo
    }).catch((e) => {
      res.status(400).send(e);
    });
  }
});

app.delete('/todos/:id', authenticate, (req, res) => {
  let id = req.params.id;

  if(!ObjectID.isValid(id)) {
    return res.status(404).send('Invalid ID.');
  }

    Todo.findOneAndRemove({
      _id: id,
      _creator: req.user._id
    }).then((todo) => {
      if (!todo) {
        return res.status(404).send('Todo not found.')
      }
      res.send({todo}); //send the object containing the todo
    }).catch((e) => {
      res.status(400).send(e);
    });

});

app.patch('/todos/:id', authenticate, (req,res) => {
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

  Todo.findOneAndUpdate({_id:id, _creator:req.user._id}, {$set:body},{new: true}).then((todo) => {
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
  }).then((token) => {
    res.header('x-auth', token).send(user);
  }).catch((e) => {
    res.status(400).send(e);
  })
});


app.get('/users/me', authenticate, (req,res) => {
    res.send(req.user);
  });
app.listen(port, () => {  //To add: if(!module.parent) {} This will resolve the Error: listen EADDRINUSE :::3000
  console.log(`Started up on port ${port}`);
});

//POST /users/login {email, password}
app.post('/users/login', (req,res) => {
  let body = _.pick(req.body, ['email', 'password']);

  User.findByCredentials(body.email, body.password).then((user) => {
    // |res.send(user);
    return user.generateAuthToken().then((token) => {
    res.header('x-auth', token).send(user);
    });
  }).catch((e) => {
    res.status(400).send('Login or password incorrect.');
  });
});

app.delete('/users/me/token', authenticate,(req,res) => {
  req.user.removeToken(req.token).then(() => {
    res.status(200).send();
  },() => {
    res.status(400).send();
  });
});

module.exports = {app}
