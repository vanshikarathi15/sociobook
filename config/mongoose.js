const mongoose = require('mongoose');

mongoose.connect('mongodb://localhost/sociobook_development');

const db = mongoose.connection;

db.on('error', console.error.bind(console, 'error connecting to db'));
//finaly if connection is successful
db.once('open', function() {
    // we're connected!
    console.log('Successfully connected to database');
  });

  module.exports = db;