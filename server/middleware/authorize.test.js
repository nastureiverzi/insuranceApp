const sinon = require('sinon');
const expect = require('expect');
const mock = require('mock-require');

mock('jwt', { TokenExpiredError: sinon.fake()});
mock('../models/user', { User: {}});
mock('../models/role', { Role: {}});

const jwt = require('jsonwebtoken');

const { User } = require('../models/user');
const { authorize } = require('./authorize');

describe('Authorize', () => {
    it('should return 401 for expired token', () => {

        jwt.verify = sinon.fake.throws(new jwt.TokenExpiredError());

        const req = {
            header: sinon.fake.returns('aToken')
        };

        const res = {};
        res.status = sinon.fake.returns(res);
        res.end = sinon.fake.returns(res);

        const next = sinon.fake();

        authorize()(req, res, next);

        expect(res.status.calledWith(401)).toBeTruthy();
    });

    it('should return 400 if token not valid', () => {
        jwt.verify = sinon.fake.throws(new Error());

        const req = {
            header: sinon.fake.returns('aToken')
        };

        const res = {};
        res.status = sinon.fake.returns(res);
        res.end = sinon.fake.returns(res);

        const next = sinon.fake();

        authorize()(req, res, next);

        expect(res.status.calledWith(400)).toBeTruthy();
    });

    it('should return 404 if user not found', async () => {
        User.findById = sinon.fake.returns({
            populate: sinon.fake.resolves(null)
        });

        jwt.verify = sinon.fake.returns('123');

        const req = {
            header: sinon.fake.returns('aToken')
        };

        const res = {};
        res.status = sinon.fake.returns(res);
        res.end = sinon.fake.returns(res);

        const next = sinon.fake();

        await (authorize()(req, res, next));

        expect(res.status.calledWith(404)).toBeTruthy();
    });

    it('should return 403 if user not authorized', async () => {
        User.findById = sinon.fake.returns({
            populate: sinon.fake.resolves({
                id:'123', 
                name:'Raluca', 
                role: {
                    name: 'user', 
                    permissions: 'read_client_data'
                }
            })
        });

        jwt.verify = sinon.fake.returns('123');

        const req = {
            header: sinon.fake.returns('aToken')
        };

        const res = {};
        res.status = sinon.fake.returns(res);
        res.end = sinon.fake.returns(res);

        const next = sinon.fake();

        await (authorize('read_policy_data')(req, res, next));

        expect(res.status.calledWith(403)).toBeTruthy();
    });
})