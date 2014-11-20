'use strict';

/**
* Module dependencies.
*/
var should = require('should'),
    supertest = require('supertest'),
    app = require('../../server');


describe('requests unit tests', function () {
    this.timeout(45000);
    let id;
    let requestBody = ['a', 'b', 'c'];
    before(function (done) {
        supertest(app).
            post('/urls').
            end(function (err, res) {
                res.status.should.equal(200);
                id = res.body._id;
                done();
            });
    });

    describe('create request', function () {
        it('should create request which is read by the response', function (done) {
            // client request
            supertest(app).
                post('/r/' + id).
                end(function (err, res) {
                    res.status.should.equal(200);
                    res.body.toString().should.equal(requestBody.toString());
                    done();
                });
            // user response
            supertest(app).
                post('/responses/' + id).
                send({'body': requestBody}).
                end(function (err, res) {
                    res.status.should.equal(200);
                });
        });
    });

    describe('empty request', function () {
        it('should error gracefully', function (done) {
            // client request
            supertest(app).
                post('/r/').
                end(function (err, res) {
                    res.status.should.equal(404);
                    done();
                });
        });
    });

    after(function (done) {
        supertest(app).
            delete('/urls/' + id).
            end(function (err, res) {
                res.status.should.equal(200);
                supertest(app).
                    delete('/responses/' + id).
                    end(function (err, res) {
                        res.status.should.equal(200);
                        done();
                    });
            });
    });
});

