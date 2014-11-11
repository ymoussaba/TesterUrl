var config = require('./config'),
    mongoose = require('mongoose'),
    connections = {};

mongoose.set('debug',  process.env.MONGO_DEBUG);

connections.main = mongoose.createConnection(config.db);
connections.requests = mongoose.createConnection(config.db+'-requests');

connections.main.on('error', console.error.bind(console, 'connection error:'));
//connections.main.once('open', function callback() {
//    console.log('main connection open');
//});
connections.requests.on('error', console.error.bind(console, 'connection error:'));
//connections.requests.once('open', function callback() {
//    console.log('requests connection open');
//});

module.exports = connections;

