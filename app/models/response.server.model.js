'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
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

mongoose.model('Response', ResponseSchema);
