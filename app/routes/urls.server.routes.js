'use strict';

module.exports = function (app) {
    var users = require('../../app/controllers/users');
    var urls = require('../../app/controllers/urls');

    // Urls Routes
    app.route('/urls')
        .get(urls.list)
        .post(urls.create);

    app.route('/urls/:urlId')
        .get(urls.read)
        .delete(urls.delete);

    // Finish by binding the Url middleware
    app.param('urlId', urls.urlByID);
};
