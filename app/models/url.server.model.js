'use strict';

/**
 * Module dependencies.
 */

var connections = require('../../config/dbs'),
    mongoose = require('mongoose'),
    Schema = mongoose.Schema;

/**
 * Url Schema
 */
var UrlSchema = new Schema({
    name: {
        type: String,
        default: '',
        trim: true
    },
    created: {
        type: Date,
        default: Date.now
    }
});

module.exports = connections.main.model('Url', UrlSchema);
