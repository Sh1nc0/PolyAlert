'use strict';

const express = require('express');
let api = require('./api/api');

const app = express();

app.use(express.static('public'));
app.use('/api', api);

app.listen(8080);
