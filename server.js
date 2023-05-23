'use strict';

const express = require('express');
let api = require('./api/api');

const app = express();

app.use('/public', express.static('public'));
app.use('/api', api);

app.use(function (req, res) {
    res.sendFile('public/index.html', {'root': __dirname});
});

app.listen(8080);
