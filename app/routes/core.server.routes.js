'use strict';

module.exports = function (app) {

    // based on http://stackoverflow.com/questions/17898183/node-js-301-redirect-non-www-without-express
    // and redirecting as 301 for SEO
    app.get ('/*', function (req, res, next){
        if (req.headers.host.match(/^www\.testerurl\.com/)) {
            res.writeHead (301, {'Location': 'http://testerurl.com'});
            res.end();
            return;
        }
        else {
            return next();
        }
    } );

    var core = require('../../app/controllers/core');
    app.route('/').get(core.index);
};
