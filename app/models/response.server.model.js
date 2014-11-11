'use strict';

/**
 * Module dependencies.
 */
var connections = require('../../config/dbs'),
    mongoose = require('mongoose'),
    Schema = mongoose.Schema;

/**
 * Response Schema
 */
var ResponseSchema = new Schema({
    name: {
        type: String,
        default: '',
        trim: true
    },
    body: {
        type: Object,
        default: ''
    },
    user: {
        type: Schema.ObjectId,
        ref: 'User'
    }
});

module.exports = connections.main.model('Response', ResponseSchema);
