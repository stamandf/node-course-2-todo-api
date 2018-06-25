const {ObjectID} = require('mongodb'); //Load in objectid from mondodb library
const {mongoose} = require('./../server/db/mongoose');
const {Todo} = require('./../server/models/todo');
const {User} = require('./../server/models/user');

let id = '5b312bdbbb32081b0baa8406';
let uid = '5b1d565828e64b0f505590ec';

if(!ObjectID.isValid(id)) {
  console.log('Invalide ID.');
}

// Todo.find({
//   _id: id
// }).then((todos) => {
//   console.log('Todos:', todos);
// });
//
// Todo.findOne({
//   _id: id
// }).then((todo) => {
//   console.log('Todo:', todo);
// });

// Todo.findById(id).then((todo) => {
//   if (!todo) {
//     return console.log('Id not found.');
//   }
//   console.log('Todo By Id', todo);
// }).catch((e) => console.log(e));

User.findById(uid).then((user) => {
  if (!user) {
    return console.log('User not found.');
  }
  console.log('User By Id:', user);
}).catch((e) => console.log(e));

User.findOne({
  _id: uid
}).then((user) => {
  console.log('User:', user);
});
