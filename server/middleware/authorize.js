const jwt = require('jsonwebtoken');
const config = require('../config/config.json');

const { User } = require('../models/user');
const { Role } = require('../models/role');

const authorize = (...permissions) => {
    return async (req, res, next) => {
        const token = req.header('x-auth');
        let decoded;
        try {
            decoded = jwt.verify(token, config.JWT_SECRET);
        } catch (err) {
            if (err instanceof jwt.TokenExpiredError) {
                return res.status(401).end();
            } else {
                return res.status(500).end();
            }
        }

        try {
            user = await User.findById(decoded._id).populate({ path: 'role', model: Role });
            if (!user) {
                return res.status(404).end();
            }

            if (!permissions.every(p => user.role.permissions.includes(p))) {
                return res.status(403).end();
            }

            req.user = user;
            return next();
        } catch (err) {
            return res.status(500).end();
        };
    }
}

module.exports = {
    authorize
};