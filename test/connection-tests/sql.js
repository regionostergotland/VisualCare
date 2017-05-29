var should = require('should');
var assert = require('assert');
var mysql = require('mysql');
var addTimeout = require("addTimeout");
var extend = require("config-extend");

describe('#Testing the connection to the database', function() {
  var correctConfig;

  beforeEach('Reset config file for each test', function(done) {
    correctConfig = {
        host: '37.139.0.36',
        user: 'grupp5',
        password: '2ed68dda1fcde20797bb560864b23999',
        database: 'patientData'
    }
      done();
  });

  afterEach('Description', function(done) {

      done();
  });

    describe('#success', function() {
        it('Should connect successfully', function(done) {
            var connection = mysql.createConnection(correctConfig);
            connection.connect(function(err) {
                if (err) {
                    return done(new Error('Cannot connect to database!'));
                } else {
                    return done();
                }
            });
        });
    })

    describe('#fail', function() {
        it('Should connect unsuccessfully with incorrect password', function(done) {
            var connection = mysql.createConnection(
                extend(correctConfig, {
                    password: 'incorrectPass'
                })
            );
            connection.connect(function(err) {
                if (err) {
                    err.should.have.property('code', 'ER_ACCESS_DENIED_ERROR');
                    err.should.have.property('errno', 1045);
                    return done();
                } else {
                    return done(new Error('Connected with incorrect password!'));
                }
            });
        });
    })

    describe('#fail', function() {
        it('Should connect unsuccessfully with incorrect user', function(done) {
            var connection = mysql.createConnection(
                extend(correctConfig, {
                    user: 'grupp6'
                })
            );
            connection.connect(function(err) {
                if (err) {
                    err.should.have.property('code', 'ER_ACCESS_DENIED_ERROR');
                    err.should.have.property('errno', 1045);
                    return done();
                } else {
                    return done(new Error('Connected with incorrect user!'));
                }
            });
        });
    })

    describe('#fail', function() {
        it('Should connect unsuccessfully with incorrect database', function(done) {
            var connection = mysql.createConnection(
                extend(correctConfig, {
                    database: 'incorrectDatabase'
                })
            );
            connection.connect(function(err) {
                if (err) {
                    err.should.have.property('code', 'ER_DBACCESS_DENIED_ERROR');
                    err.should.have.property('errno', 1044);
                    return done();
                } else {
                    return done(new Error('Connected to incorrect database!'));
                }
            });
        });
    })

    describe('#fail', function() {
        it('Should connect unsuccessfully with incorrect ip', function(done) {
            var connection = mysql.createConnection(
                extend(correctConfig, {
                    host: 'incorrect_host',
                })
            );
            function connectCallBack() {
                return done(new Error('Unexpected Calls'));
            }

            connection.connect(function(err){
              if(err){
                err.should.have.property('code', 'ENOTFOUND');
                err.should.have.property('errno', 'ENOTFOUND');
                return done();
              } else{
                return done(new Error('Connected to incorrect host!'));
              }
            });

        });
    })
});
