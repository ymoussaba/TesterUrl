//'use strict';
//
///**
//* Module dependencies.
//*/
//var should = require('should'),
//    supertest = require('supertest'),
//    app = require('../../server');
//
//describe('urls unit tests', function () {
//
//    let id;
//    describe('create urls', function () {
//        it('should create url', function (done) {
//            supertest(app).
//                post('/urls').
//                end(function (err, res) {
//                    res.status.should.equal(200);
//                    id = res.body._id;
//                    done();
//                });
//        });
//    });
//
//    afterEach(function (done) {
//        supertest(app).
//            delete('/urls/' + id).
//            end(function (err, res) {
//                res.status.should.equal(200);
//                done();
//            });
//    });
//});
//
