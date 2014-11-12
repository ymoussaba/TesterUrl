'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
    errorHandler = require('./errors'),
    Response = require('../models/response.server.model'),
    _ = require('lodash'),
    connections = require('../../config/dbs');

/**
 * Create a Response
 */
exports.create = function (req, res, next) {
    Response.findOneAndUpdate({_id:req.params.id}, {'body': req.body.body}, {upsert:true}, function(err, data) {
        if (err) {
            return res.status(400).send({
                message: errorHandler.getErrorMessage(err)
            });
        } else {
            let channel = connections.client.channel('mubsub.response');
            channel.publish(data._doc._id.toString(), data._doc.body);
            res.jsonp(data._doc.body);
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
