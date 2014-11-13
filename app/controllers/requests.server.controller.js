'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
    errorHandler = require('./errors'),
    Response = require('../models/response.server.model'),
    _ = require('lodash'),
    connections = require('../../config/dbs');

exports.handleClientRequest = function (req, res, next) {

    let id = req.params.id;
    let request = {};
    request.remoteAddress = req._remoteAddress;
    request._id = req.params.id;
    request.url = req.url;
    request.method = req.method;
    request.headers = req.headers;
    request.query = req.query;
    request.body = req.body;
    request.httpVersion = req.httpVersion;
    request.secret = req.secret;
    request.session = req.session;

    let channel = connections.client.channel('mubsub.request');
    channel.publish(req.params.id, request);
    let subscription;

    Response.findById(id, function (err, response) {
        if (err)
            return next(new Error('Failed to load Response ' + id));
        if (!response || response._doc.body === null) {
            let channel = connections.client.channel('mubsub.response');
            subscription = channel.subscribe(id, function (response) {
                subscription.unsubscribe();
                res.jsonp(response);
            });
        }
        else {
            res.json(response._doc.body);
        }
    });

    res.on('close', function() {
        if(subscription) {
            subscription.unsubscribe();
        }
    });
};

/**
 * Request middleware
 */
exports.requestByID = function (req, res, next) {
    let channel = connections.client.channel('mubsub.request');
    let subscription = channel.subscribe(req.params.id, function (request) {
        res.jsonp(request);
        subscription.unsubscribe();
    });

    res.on('close', function() {
        if(subscription) {
            subscription.unsubscribe();
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
