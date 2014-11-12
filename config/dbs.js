var config = require('./config'),
    mongoose = require('mongoose'),
    mubsub = require('mubsub'),
    connections = {};

mongoose.set('debug',  process.env.MONGO_DEBUG);

connections.main = mongoose.createConnection(config.db);
connections.main.on('error', console.error.bind(console, 'connection error:'));

connections.client = mubsub(config.db);
connections.client.on('error', console.error);

module.exports = connections;

