const expect = require('expect');
const request = require('supertest');
const sinon = require('sinon');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const axios = require('axios');
const mock = require('mock-require');

mock('jwt', {});
mock('./db/mongoose', {});
mock('./models/user', { User: {}});
mock('./middleware/authorize', {
    authorize: sinon.fake.returns(function (req, res, next) {
        return next();
    })
});

const { app } = require('./server');
const { User } = require('./models/user');

const clientData = {
    data: {
        clients: [{
            id: '123',
            name: 'Mae',
            email: 'mae@gmail.com',
            role: 'user'
        },
        {
            id: '1234',
            name: 'Millie',
            email: 'millie@gmail.com',
            role: 'admin'
        }]
    }
};

const policyData = {
    data: {
        policies: [{
            id: "456",
            amountInsured: 1825,
            email: "inesblankenship@quotezart.com",
            inceptionDate: "2016-06-01T03:33:32Z",
            installmentPayment: true,
            clientId: "123"
        },
        {
            id: "789",
            amountInsured: 1234,
            email: "inesblankenship@quotezart.com",
            inceptionDate: "2016-06-01T03:33:32Z",
            installmentPayment: true,
            clientId: "1234"
        }, {
            id: "3478",
            amountInsured: 1234,
            email: "inesblankenship@quotezart.com",
            inceptionDate: "2016-06-01T03:33:32Z",
            installmentPayment: true,
            clientId: "1234567"
        },  {
            id: "34780",
            amountInsured: 1234,
            email: "inesblankenship@quotezart.com",
            inceptionDate: "2016-06-01T03:33:32Z",
            installmentPayment: true,
            clientId: "123"
        }]
    }
};


describe('POST /users/login', () => {
    it('should return a token', (done) => {
        User.findOne = sinon.fake.returns({
            _id: '123',
            name: 'Raluca',
            password: 'something'
        });

        jwt.sign = sinon.fake.returns('token');
        bcrypt.compare = sinon.fake.resolves(true);

        request(app)
            .post('/users/login')
            .send({})
            .expect(200)
            .expect((res) => {
                expect(res.header['x-auth']).toBeTruthy();
            })
            .end((err, res) => {
                if (err) {
                    return done(err);
                }

                done();
            });
    });

    it('should return a 404 if user not found', (done) => {
        User.findOne = sinon.fake.returns(null);

        jwt.sign = sinon.fake.returns('token');
        bcrypt.compare = sinon.fake.resolves(true);
        request(app)
            .post('/users/login')
            .send(user)
            .expect(404)
            .end(done);
    });

    it('should return a 400 if password is incorect', (done) => {
        User.findOne = sinon.fake.returns({
            _id: '123',
            name: 'Raluca',
            password: 'something'
        });

        jwt.sign = sinon.fake.returns('token');
        bcrypt.compare = sinon.fake.resolves(false);

        request(app)
            .post('/users/login')
            .send(user)
            .expect(400)
            .end(done);
    });
});

describe('GET /clients/:id', () => {
    it('should return a client by id', (done) => {
        axios.get = sinon.fake.resolves(clientData);

        request(app)
            .get('/clients/123')
            .set('x-auth', 'token')
            .expect(200)
            .expect((res) => {
                expect(res.body).toBeTruthy();
                expect(res.body.name).toBe('Mae');
                expect(res.body.email).toBe('mae@gmail.com');
                expect(res.body.role).toBe('user');
            })
            .end((err, res) => {
                if (err) {
                    return done(err);
                }

                done();
            });
    });

    it('should return 404 if client not found', (done) => {
        axios.get = sinon.fake.resolves(clientData);

        request(app)
            .get('/clients/123456')
            .set('x-auth', 'token')
            .expect(404)
            .end(done)
    });
});

describe('GET /clients/byname/:name', () => {

    it('should return a client by name', (done) => {
        axios.get = sinon.fake.resolves(clientData);

        request(app)
            .get('/clients/byname/Mae')
            .set('x-auth', 'token')
            .expect(200)
            .expect((res) => {
                expect(res.body).toBeTruthy();
                expect(res.body.name).toBe('Mae');
                expect(res.body.email).toBe('mae@gmail.com');
                expect(res.body.role).toBe('user');
            })
            .end((err, res) => {
                if (err) {
                    return done(err);
                }

                done();
            });
    });

    it('should return 404 if client not found', (done) => {
        axios.get = sinon.fake.resolves(clientData);

        request(app)
            .get('/clients/byname/Raluca')
            .set('x-auth', 'token')
            .expect(404)
            .end(done)
    });
});

describe('GET /clients/bypolicy/:id', () => {
    it('should return a client associated with given policy', (done) => {
        axios.get = function fakeGet() {
            fakeGet.seq = ++fakeGet.seq || 0;
            return Promise.resolve(fakeGet.seq ? clientData : policyData);
        }

        request(app)
            .get('/clients/bypolicy/456')
            .set('x-auth', 'token')
            .expect(200)
            .expect((res) => {
                expect(res.body).toBeTruthy();
                expect(res.body.name).toBe('Mae');
                expect(res.body.email).toBe('mae@gmail.com');
                expect(res.body.role).toBe('user');
            })
            .end((err, res) => {
                if (err) {
                    return done(err);
                }

                done();
            });
    });

    it('should return 404 is policy not found', (done)=>{
        axios.get = function fakeGet() {
            fakeGet.seq = ++fakeGet.seq || 0;
            return Promise.resolve(fakeGet.seq ? clientData : policyData);
        }

        request(app)
            .get('/clients/bypolicy/000')
            .set('x-auth', 'token')
            .expect(404)
            .end(done)
    });

    it('should return 404 is client not found', (done)=>{
        axios.get = function fakeGet() {
            fakeGet.seq = ++fakeGet.seq || 0;
            return Promise.resolve(fakeGet.seq ? clientData : policyData);
        }

        request(app)
            .get('/clients/bypolicy/3478')
            .set('x-auth', 'token')
            .expect(404)
            .end(done)
    });
});

describe('GET /policies/:clientId', ()=>{
    it('should return a list of policies associated with a client', (done)=>{
        axios.get = sinon.fake.resolves(policyData);

        request(app)
        .get('/policies/123')
        .set('x-auth', 'token')
        .expect(200)
        .expect((res) => {
            expect(res.body.length).toBe(2);
        })
        .end((err, res) => {
            if (err) {
                return done(err);
            }

            done();
        });
    });

    it('should return 404 if no policies were found', (done)=>{
        axios.get = sinon.fake.resolves(policyData);

        request(app)
            .get('/policies/347821')
            .set('x-auth', 'token')
            .expect(404)
            .end(done)
    });
});