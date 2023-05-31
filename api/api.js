

let express = require('express');
let user = require('./routes/user');
let report = require('./routes/report');
let issue = require('./routes/issue');
let login = require('./routes/login');
let logout = require('./routes/logout');

var bodyParser = require('body-parser');

module.exports = function (passport) {
    let app = express.Router();

    app.use(bodyParser.urlencoded({
        extended: false,
    }));

    app.use(bodyParser.json());

    app.use('/users', user);
    app.use('/reports', report);
    app.use('/issues', issue);
    app.use('/login', login(passport));
    app.use('/logout', logout);

    return app;
};

