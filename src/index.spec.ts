import authMiddleware from './index';
import { expect } from 'chai';
import express from 'express';
import * as superagent from 'superagent'
import { sign } from 'jsonwebtoken'
import { Server } from 'http'

describe('express integration', function() {
    let app;
    let server: Server;
    process.env.JWT_SECRET = 'Testaringo.2022';
    var token = sign({
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
            res.status(200).json(req.user);
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
            expect(res.statusCode).to.equal(200);
            done();
        });
    });

    it('should get user data', function (done) {
        superagent.get('http://localhost:8080/test')
        .set({'Authorization': `Bearer ${token}`})
        .send().end((err,res)=>{
            expect(res.statusCode).to.equal(200);
            expect(res.body._id).to.equal('ababababa');
            done();
        });
    });

    it('should unautorize', function (done) {
        superagent.get('http://localhost:8080/test')
        .set({'Authorization': `Bearer 123123`})
        .send().end((err,res)=>{
            expect(res.statusCode).to.equal(401);
            done();
        });
    });
})