//const MongoClient = require('mongodb').MongoClient;
const {MongoClient, ObjectID} = require('mongodb');
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
   // db.collection('Todos').findOneAndUpdate(
   //   {_id: new ObjectID('5b198572f36c93f92e262408')},
   //   {$set: {completed: true}},
   //   {returnOriginal: false}).then((result) => {
   //   console.log(result);
   // });

   //update the age
   db.collection('Users').findOneAndUpdate(
     {_id: new ObjectID('5b0326a3f464c0a801ef3f04')},
     {$set: {name: 'Julie'},
      $inc: {age: 33}},
     {returnOriginal: false}).then((result) => {
     console.log(result);
   });


//client.close();
});
