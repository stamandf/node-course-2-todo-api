const {ObjectID} = require('mongodb');

let express = require('express');
let bodyParser = require('body-parser');

let {mongoose} = require('./db/mongoose');
let {Todo} = require('./models/todo');
let {User} = require('./models/user');

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
app.listen(port, () => {
  console.log(`Started up on port ${port}`);
});

module.exports = {app}
