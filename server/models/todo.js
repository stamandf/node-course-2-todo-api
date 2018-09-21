let mongoose = require('mongoose')

let Todo = mongoose.model('Todo', {
  text: {
    type: String,
    required:true,
    minlength:1,
    trim:true
  },
  completed: {
    type: Boolean,
    default: false
  },
  completedAt: {
    type: Number,
    default: null
  },
  _creator: { // _<name> indicates that it is an ObjectId
    type: mongoose.Schema.Types.ObjectId,
    required: true
  }
});

module.exports = {Todo};
