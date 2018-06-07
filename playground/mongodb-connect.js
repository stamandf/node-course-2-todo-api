//const MongoClient = require('mongodb').MongoClient;
const {MongoClient, ObjectID} = require('mongodb');

var obj = new ObjectID();
console.log(obj);
// let user = {name:'Andrew', age: 25};  //Object destructuring
// let {name} = user;
// console.log(name);
MongoClient.connect('mongodb://localhost:27017/TodoApp',(err, client) => {
   if(err) {
     return console.log('Unable to connect to MongoDB server.');
   }
   console.log('Connected to MongoDB server.');
   const db = client.db('TodoApp');
   client.close();
  

//    db.collection('Todos').insertOne({
//      text: 'Something to do',
//      completed: false
//    }, (err,result) => {
//      if (err) {
//        return console.log('Unable to insert todo', err);
//      }
//      console.log(JSON.stringify(result.ops, undefined, 2));
//    });
//    client.close()
// });
//
//    db.collection('Users').insertOne({
//      name: 'Patrick Mercier',
//      age: 17,
//      location:'Montreal'
//    }, (err,result) => {
//      if (err) {
//        return console.log('Unable to insert user', err);
//      }
//      console.log(JSON.stringify(result.ops._id, undefined, 2));
//    });
//    client.close()
// });

// db.collection('Users').insertOne({
//   name: 'Martine Lafontaine',
//   age: 12,
//   location:'Montreal'
// }, (err,result) => {
//   if (err) {
//     return console.log('Unable to insert user', err);
//   }
//   console.log(JSON.stringify(result.ops, undefined, 2));
// });
// client.close()
// });

// // db.collection('Users').insertOne({
// //   name: 'Hugo Cavalieri',
// //   age: 21,
// //   location:'Montreal'
// // }, (err,result) => {
// //   if (err) {
// //     return console.log('Unable to insert user', err);
// //   }
// //   console.log(JSON.stringify(result.ops, undefined, 2));
// // });
// client.close()
// });
