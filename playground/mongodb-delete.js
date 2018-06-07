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
 //deleteMany
   // db.collection('Todos').deleteMany({text: 'Eat lunch'}).then((result) => {
   //   console.log(result);
   // });
 //deleteOne
 // db.collection('Todos').deleteOne({text: 'Eat Lunch'}).then((result) => {
 //   console.log(result);
 // });

 //findOneAndDelete
 db.collection('Users').findOneAndDelete({
   _id: new ObjectID('5b199958f36c93f92e262834')
 }).then((result) => {
   console.log(JSON.stringify(result,undefined,2));
 });

 db.collection('Users').deleteMany({location: 'Los Angeles'}).then((result) => {
   console.log(result);
 });


//client.close();
});
