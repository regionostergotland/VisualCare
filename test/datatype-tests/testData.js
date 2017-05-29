/** require */
require('sql-require');
var should = require('should');
var assert = require('assert');
var mysql = require('mysql');
var chai = require('chai');
var addTimeout = require("addTimeout");
var execsql = require('execsql');
var Database = require('./../../js/database.js')
var SQL = require('./createDataBase.sql'); //database creation script
var isPersonnummer = require('is-personnummer');

/** global objects */
var db = new Database();
var expect = chai.expect;

describe('#Testing that the data in the database is correct', function() {
    beforeEach('Set up a new database for each test', function(done) {
        db.startConnection();
        for (var sql of SQL) {
            db.sendQuery(sql, function(error, results, fields) {
                if (error) {
                    throw error;
                }
            });
        }
        db.addRandomPersons(10);
        done();
    });

    afterEach('Close connection after each test', function(done) {
        db.endConnection();
        done();
    });

    describe('#success', function() {
        this.timeout(4000); // this takes a bit of time so the timout is increased
        it('Check that dates are correct', function(done) {
            db.sendQuery('Call getAllPersons()', function(error, results, fields) {
                if (error) throw error;
                for (var i in results[0]) {
                    // expect(isPersonnummer(results[0][i].personNumber)).to.be.a.true;
					// This would work if we are dealing with real people..
                    expect(results[0][i].startDate).to.be.a('date');
                    expect(results[0][i].stopDate).to.be.a('date');
                }
                done();
            });
        });
    })
})
