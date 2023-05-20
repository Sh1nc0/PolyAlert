'use strict';

let express = require('express');
let app = express.Router();
let user = require('./routes/user');

var bodyParser = require('body-parser');

// configure the app to use bodyParser()
app.use(bodyParser.urlencoded({
    extended: false,
}));

app.use(bodyParser.json());

app.use('/users', user);

module.exports = app;