'use strict';

module.exports = function(app) {
	var users = require('../../app/controllers/users');
	var responses = require('../../app/controllers/responses');

	app.route('/responses/:id').
		post(responses.create).
		delete(responses.delete);
};
