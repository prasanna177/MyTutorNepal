const mongoose = require('mongoose');

mongoose.connect(process.env.MONGO_URL);

const connection = mongoose.connection;

connection.on('connected', () => {
  console.log('MongoDB conncetion is successful');
})

connection.on('error', (err) => {
  console.log(err);
})

module.exports = mongoose; 