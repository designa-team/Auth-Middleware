var authMiddleware = require('./lib/index.js');
var assert = require('assert');
var express = require('express');
var superagent = require('superagent');
var jsonwebtoken = require('jsonwebtoken');

describe('express integration', function() {
    var app;
    var server;
    process.env.JWT_SECRET = 'Testaringo.2022';
    var token = jsonwebtoken.sign({
        email: 'test@email.com'
        , name: 'Don TEst'
        , phone: '5252525252'
        , _id: 'ababababa'
      },
      process.env.JWT_SECRET
    );

    beforeEach(function() {
        app = express();
        app.get('/test', authMiddleware, function(req, res){
            res.status(200).json({'ok':'ok'});
        });
        server = app.listen(8080);
    });

    afterEach(function() {
        server.close();
    });

    it('should autorize', function (done) {
        superagent.get('http://localhost:8080/test')
        .set({'Authorization': `Bearer ${token}`})
        .send().end((err,res)=>{
            assert.equal(res.statusCode, 200)
            done();
        });
    });

    it('should unautorize', function (done) {
        superagent.get('http://localhost:8080/test')
        .set({'Authorization': `Bearer 123123`})
        .send().end((err,res)=>{
            assert.equal(res.statusCode, 403)
            done();
        });
    });
})