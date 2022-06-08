const { ObjectID } = require('mongodb');
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const { User } = require('../models/user');
const { Role } = require('../models/role');

const roleOneId = new ObjectID();
const roleTwoId = new ObjectID();

const roles = [{
    _id: roleOneId,
    name: 'admin',
    permissions: ['read_client_data', 'read_policy_data']
}, {
    _id: roleTwoId, 
    name: 'user',
    permissions: ['read_client_data']
}];

const getUsers = async () => [{
    name: 'Raluca',
    password: await bcrypt.hash('something', 10), 
    role: roleOneId
}, {
    name: 'George',
    password: await bcrypt.hash('somethingElse', 10), 
    role: roleTwoId
}];

const populateUsers = async () => {
    await User.collection.drop();
    const users = await getUsers();
    await User.insertMany(users);
};

const populateRoles = async () => {
    await Role.collection.drop();
    await Role.insertMany(roles);    
}

module.exports = {
    populateUsers, 
    populateRoles
}