const mongoose = require('mongoose');

const RoleSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        minlength: 4,
        unique: true,
    },
    permissions: [{
        type: String,
        require: true,
        minlength: 4
    }]
});

const Role = mongoose.model('Role', RoleSchema);

module.exports = {
    Role
}