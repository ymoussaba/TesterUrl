'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
    errorHandler = require('./errors'),
    Response = mongoose.model('Response'),
    _ = require('lodash');

/**
 * Create a Response
 */
exports.create = function (req, res, next) {
    var response = new Response({_id: req.params.id, 'body': req.body.body});
    response.user = req.user;

    Response.findById(req.params.id).exec(function (err, data) {
        if (err)
            return next(err);
        if (!data) {
            response.save(function (err) {
                if (err) {
                    return res.status(400).send({
                        message: errorHandler.getErrorMessage(err)
                    });
                } else {
                    res.jsonp(response);
                }
            });
        }
        else {
            data.body = response._doc.body;
            data.save(function (err) {
                if (err) {
                    return res.status(400).send({
                        message: errorHandler.getErrorMessage(err)
                    });
                } else {
                    res.jsonp(response);
                }
            });
        }
    });
};

/**
 * Update a Response
 */
exports.update = function (req, res) {
    var response = req.response;

    response = _.extend(response, req.body);

    response.save(function (err) {
        if (err) {
            return res.status(400).send({
                message: errorHandler.getErrorMessage(err)
            });
        } else {
            res.jsonp(response);
        }
    });
};

/**
 * Delete an Response
 */

exports.delete = function (req, res, next) {
    var id = req.params.id;
    Response.findById(id).exec(function (err, response) {
        if (err)
            return next(err);
        else if (response) {
            response.remove(function (err) {
                if (err) {
                    return res.status(400).send({
                        message: errorHandler.getErrorMessage(err)
                    });
                } else {
                    res.jsonp(response);
                }
            });
        }
    });
};

/**
 * Response authorization middleware
 */
exports.hasAuthorization = function (req, res, next) {
    if (req.response.user.id !== req.user.id) {
        return res.status(403).send('User is not authorized');
    }
    next();
};
