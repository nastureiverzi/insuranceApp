require('./config/config.js');
const { populateUsers, populateRoles } = require('./db/mockdata.js');
const { mongoose } = require('./db/mongoose');

(async () => {
    await populateRoles();
    await populateUsers();
})();