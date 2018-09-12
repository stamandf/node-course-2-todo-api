const {SHA256} = require('crypto-js');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');

// let data = {id: 10};
//
// let token = jwt.sign(data,'123abc');
//
// console.log(token);
//
// let decoded = jwt.verify(token,'123abc');
// console.log('Decoded:', decoded);

let password = '123abc';

bcrypt.genSalt(10, (err, salt) => {
  bcrypt.hash(password, salt, (err, hash) => {
    console.log(hash);
  });
});

let hashedpassword = '$2a$10$eQGm02jLzVd4J0M322I8k.1TUjCldKYNrB7Yf4tZXdlqDSzfz1jxO';

bcrypt.compare(password, hashedpassword, (err,res) => {
  console.log(res);
})
