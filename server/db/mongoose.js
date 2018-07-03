let mongoose = require('mongoose');

mongoose.Promise = global.Promise; //set up to use Promises
mongoose.connect(process.env.MONGODB_URI);

module.exports.mongoose = {mongoose};
