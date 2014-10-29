'use strict';

module.exports = function(app) {
	var users = require('../../app/controllers/users');
	var requests = require('../../app/controllers/requests');

	// Requests Routes
	app.route('/requests/:id').
		get(requests.requestByID).
		delete(requests.delete);

	app.route('/r/:id').all(requests.handleClientRequest);
};

