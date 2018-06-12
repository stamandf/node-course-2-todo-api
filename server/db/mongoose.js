let mongoose = require('mongoose');

mongoose.Promise = global.Promise; //set up to use Promises
mongoose.connect('mongodb://localhost:27017/TodoApp');

module.exports.mongoose = {mongoose};
