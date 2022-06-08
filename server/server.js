const config = require('./config/config.json');
const express = require('express');
const bodyParser = require('body-parser');
const axios = require('axios');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const { User } = require('./models/user');
const { mongoose } = require('./db/mongoose');
const { permissions } = require('./permissions/permission');
const { authorize } = require('./middleware/authorize');

const app = express();
app.use(bodyParser.json());

app.post('/users/login', async (req, res) => {
    try {
        const user = await User.findOne({ name: req.body.name });
        if (!user) {
            return res.status(404).send();
        }

        const result = await bcrypt.compare(req.body.password, user.password);
        if (!result) {
            return res.status(400).end();
        }

        const token = jwt.sign({ _id: user._id.toString() }, config.JWT_SECRET, { expiresIn: '1h' });

        res.header('x-auth', token).end();
    } catch (e) {
        res.status(500).send(e);
    }
});

app.get('/clients/:id', authorize(permissions.read_client_data), async (req, res, err) => {
    try {
        const clients = await axios.get('http://www.mocky.io/v2/5808862710000087232b75ac');
        const client = clients.data.clients.find(el => el.id === req.params.id);

        if (!client) {
            return res.status(404).end();
        }

        res.send(client);
    } catch (err) {
        res.status(500).send(err);
    }
});

app.get('/clients/byname/:name', authorize(permissions.read_client_data), async (req, res, err) => {
    try {
        const clients = await axios.get('http://www.mocky.io/v2/5808862710000087232b75ac');
        const client = clients.data.clients.find(el => el.name === req.params.name);

        if (!client) {
            return res.status(404).end();
        }

        res.send(client);
    } catch (err) {
        res.status(500).send(err);
    }
});

app.get('/clients/bypolicy/:policyId', authorize(permissions.read_policy_data), async (req, res, err) => {
    try {
        const policies = await axios.get('http://www.mocky.io/v2/580891a4100000e8242b75c5');
        const policy = policies.data.policies.find(el => el.id === req.params.policyId);

        if (!policy) {
            return res.status(404).end();
        }

        const clients = await axios.get('http://www.mocky.io/v2/5808862710000087232b75ac');
        const client = clients.data.clients.find(el => el.id === policy.clientId);

        if (!client) {
            return res.status(404).end();
        }

        res.send(client);
    } catch (err) {
        res.status(500).send(err);
    }
});

app.get('/policies/:clientId', authorize(permissions.read_policy_data), async (req, res, err) => {
    try {
        const policies = await axios.get('http://www.mocky.io/v2/580891a4100000e8242b75c5');
        const result = policies.data.policies.filter(el => el.clientId === req.params.clientId);

        if (result.length === 0) {
            return res.status(404).end();
        }

        res.send(result);
    } catch (err) {
        res.status(500).send(err);
    }
});

app.listen(3000);

module.exports = {
    app
}