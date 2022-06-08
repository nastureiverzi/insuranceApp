const mongoose = require('mongoose');
const config = require('../config/config.json');

mongoose.Promise = global.Promise;
mongoose.connect(config.MONGODB_URI);
//mongoose.set('debug', true);

module.exports = {
    mongoose
};