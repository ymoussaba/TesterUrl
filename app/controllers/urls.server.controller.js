'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
    errorHandler = require('./errors'),
    Url = mongoose.model('Url'),
    _ = require('lodash');

/**
 * Create a Url
 */
exports.create = function (req, res) {
    var url = new Url(req.body);
    url.user = req.user;

    url.save(function (err) {
        if (err) {
            return res.status(400).send({
                message: errorHandler.getErrorMessage(err)
            });
        } else {
            res.jsonp(url);
        }
    });
};

/**
 * Show the current Url
 */
exports.read = function (req, res) {
    res.jsonp(req.url);
};

/**
 * Delete an Url
 */
exports.delete = function (req, res) {
    var url = req.url;

    url.remove(function (err) {
        if (err) {
            return res.status(400).send({
                message: errorHandler.getErrorMessage(err)
            });
        } else {
            res.jsonp(url);
        }
    });
};

/**
 * List of Urls
 */
exports.list = function (req, res) {
    Url.find().sort('-created').populate('user', 'displayName').exec(function (err, urls) {
        if (err) {
            return res.status(400).send({
                message: errorHandler.getErrorMessage(err)
            });
        } else {
            res.jsonp(urls);
        }
    });
};

/**
 * Url middleware
 */
exports.urlByID = function (req, res, next, id) {
    Url.findById(id).populate('user', 'displayName').exec(function (err, url) {
        if (err) return next(err);
        if (!url) return next(new Error('Failed to load Url ' + id));
        req.url = url;
        next();
    });
};

/**
 * Url authorization middleware
 */
exports.hasAuthorization = function (req, res, next) {
    if (req.url.user.id !== req.user.id) {
        return res.status(403).send('User is not authorized');
    }
    next();
};
