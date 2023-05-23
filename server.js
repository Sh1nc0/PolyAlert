'use strict';

const express = require('express');
let api = require('./api/api');

const app = express();

const auth = require('./auth/auth');
const passport = auth(app);

app.use('/api', api(passport));

app.use('/public', express.static('public'));
app.use(function (req, res) {
    res.sendFile('public/index.html', {'root': __dirname});
});

app.listen(8080);
