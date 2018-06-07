//const MongoClient = require('mongodb').MongoClient;
const {MongoClient, ObjectID} = require('mongodb');


// let user = {name:'Andrew', age: 25};  //Object destructuring
// let {name} = user;
// console.log(name);
MongoClient.connect('mongodb://localhost:27017/TodoApp',(err, client) => {
   if(err) {
     return console.log('Unable to connect to MongoDB server.');
   }
   console.log('Connected to MongoDB server.');
   const db = client.db('TodoApp');
   // db.collection('Todos').find({
   //   _id: new ObjectID('5b031e282d22d9a6f548bcc0')
   // }).toArray().then((docs) => { //toArray is a cursor method that returns a promise
   //   console.log('Todos');
   //   console.log(JSON.stringify(docs,undefined,2));
   // }, (err) => {
   //   console.log('Unable to fetch todos', err);
   // });
   // db.collection('Todos').find().count().then((count) => { //toArray is a cursor method that returns a promise
   //   console.log(`Todos count: ${count}`);
   // }, (err) => {
   //   console.log('Unable to fetch todos', err);
   // });
   //

db.collection('Users').find({name:'Florence Saint-Amand'}).toArray().then((docs) => {
  console.log('Users named Florence');
  console.log(JSON.stringify(docs,undefined,2));
}, (err) => {
  console.log('Unable to fetch users');
});
db.collection('Users').find({location:'Montreal'}).toArray().then((docs) => {
  console.log('Users located in Montreal');
  console.log(JSON.stringify(docs,undefined,2));
}, (err) => {
  console.log('Unable to fetch users');
});
db.collection('Users').find({age: 35}).toArray().then((docs) => {
  console.log('Users aged 35 years old');
  console.log(JSON.stringify(docs,undefined,2));
}, (err) => {
  console.log('Unable to fetch users');
});
db.collection('Users').find({age:{$gt: 20}}).count().then((count) => {
  console.log(`Number of Users over the age of 20 = ${count}`);
}, (err) => {
  console.log('Unable to fetch users');
});

//client.close();
});
