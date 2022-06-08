const mongoose = require('mongoose');
const { ObjectId, String } = mongoose.Schema.Types;

const UserSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        minlength: 4,
        unique: true,
    },
    password: {
        type: String,
        require: true,
        minlength: 6
    },
    role: {
        type: ObjectId,
        require: true,
        minlength: 4, 
        ref: 'Role'
    }
});

const User = mongoose.model('User', UserSchema);

module.exports = {
    User
}