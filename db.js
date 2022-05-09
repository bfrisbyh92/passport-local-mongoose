const mongoose = require('mongoose');


mongoose.Promise = global.Promise;

mongoose.connect('mongodb://localhost:27017/node-auth')
.then(() => console.log('Connected to MongoDB on db named node-auth'))