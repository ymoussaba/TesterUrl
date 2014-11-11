'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
    errorHandler = require('./errors'),
    Request = require('../models/request.server.model'),
    Response = require('../models/response.server.model'),
    RSVP = require('rsvp'),
    _ = require('lodash');

/**
 * Create a Request
 */
exports.create = function (req, res) {
    let request = new Request(req.body);
    request.user = req.user;

    request.save(function (err) {
        if (err) {
            return res.status(400).send({
                message: errorHandler.getErrorMessage(err)
            });
        } else {
            res.jsonp(request);
        }
    });
};

exports.handleClientRequest = function (req, res, next) {
    let poll = function (id, totalWait, waitDuration, maxWait) {
        Response.findById(id).exec(function (err, response) {
            if (err)
                return next(new Error('Failed to load Response ' + id));
            if (!response || response._doc.body === null) {
                totalWait += waitDuration;
                let timer = setTimeout(poll.bind(this, id, totalWait, waitDuration, maxWait), waitDuration);
                if (totalWait >= maxWait) {
                    clearTimeout(timer);
                    res.json({'msg': 'timed out'});
                }
            }
            else {
                res.json(response._doc.body);
            }
        });
    };

    let setModel = function (req, model) {
        let promise = new RSVP.Promise(function (resolve, reject) {
            if (!model) {
                model = new Request(req);
                model.count = 0;
            }
            model.remoteAddress = req._remoteAddress;
            model._id = req.params.id;
            model.url = req.url;
            model.method = req.method;
            model.headers = req.headers;
            model.query = req.query;
            model.body = req.body;
            model.httpVersion = req.httpVersion;
            model.secret = req.secret;
            model.session = req.session;
            model.count += 1;

            model.save(function (err, data) {
                if (err) {
                    reject(err);
                } else {
                    resolve(model);
                }
            });
        });

        return promise;
    };

    let startPoll = function (model) {
        let totalWait = 0;
        let waitDuration = 500;
        let maxWait = 1000 * 60 * 10; // 10 min
        let timer = setTimeout(poll.bind(this, model._doc._id, totalWait, waitDuration, maxWait), waitDuration);
    };

    let err = function (err) {
        return res.status(400).send({
            message: errorHandler.getErrorMessage(err)
        });
    };

    let promise = Request.findById(req.params.id).exec();
    promise.then(setModel.bind(this, req), err).
        then(startPoll, err);
};

/**
 * Request middleware
 */
exports.requestByID = function (req, res, next) {
    var id = req.params.id;
    var totalWait = 0;
    var waitDuration = 500;
    var maxWait = 1000 * 60 * 10; // 10 min

    var callback = function () {
        Request.findById(id, function (err, request) {
            if (err)
                return next(err);
            if (!request) {
                totalWait += waitDuration;
                timer = setTimeout(callback, waitDuration);
                if (totalWait >= maxWait) {
                    clearTimeout(timer);
                    res.json({'msg': 'timed out'});
                    return;
                }
            }
            else {
                res.jsonp(request);
            }
        });
    };

    var timer = setTimeout(callback, waitDuration);

};

/**
 * Delete an Request
 */
exports.delete = function (req, res, next) {
    var id = req.params.id;
    Request.findById(id).exec(function (err, request) {
        if (err)
            return next(err);
        else if (request) {
            request.remove(function (err) {
                if (err) {
                    return res.status(400).send({
                        message: errorHandler.getErrorMessage(err)
                    });
                } else {
                    res.jsonp(request);
                }
            });
        }
    });
};

/**
 * Request authorization middleware
 */
exports.hasAuthorization = function (req, res, next) {
    if (req.request.user.id !== req.user.id) {
        return res.status(403).send('User is not authorized');
    }
    next();
};
