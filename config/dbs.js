var config = require('./config'),
    mongoose = require('mongoose'),
    connections = {};

mongoose.set('debug',  process.env.MONGO_DEBUG);

connections.main = mongoose.createConnection(config.db);
connections.requests = mongoose.createConnection(config.dbRequests);

connections.main.on('error', console.error.bind(console, 'connection error:'));
connections.requests.on('error', console.error.bind(console, 'connection error:'));

module.exports = connections;

