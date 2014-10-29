'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
    Schema = mongoose.Schema;

/**
 * Request Schema
 */
var RequestSchema = new Schema({
    url: {
        type: String,
        required: 'Please provide url',
        trim: true
    },
    method: {
        type: String,
        required: 'Please provide method',
        trim: true
    },
    headers: {
        type: Object,
        trim: true
    },
    query: {
        type: Object,
        trim: true
    },
    remoteAddress: {
        type: String,
        trim: true
    },
    body: {
        type: Object,
        trim: true
    },
    httpVersion: {
        type: String,
        trim: true
    },
    secret: {
        type: String,
        trim: true
    },
    session: {
        type: Object,
        trim: true
    },
    count: {
        type: Number,
        required: 'Please provide count'
    }
});

mongoose.model('Request', RequestSchema);
