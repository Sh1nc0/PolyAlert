

const express = require('express');
let api = require('./api/api');

const app = express();

const auth = require('./auth/auth');
const passport = auth(app);

app.use('/api', api(passport));

app.use('/public', express.static('public'));
app.use('/private', require('connect-ensure-login').ensureLoggedIn(), express.static('private'));
app.use('/admin', require('connect-ensure-login').ensureLoggedIn(), function (req, res, next) {
    if (req.user.role === 'Technicien')
        next();
    else
        res.status(403).send('Forbidden');

}, express.static('admin'));

app.use(function (req, res) {
    res.sendFile('public/index.html', {'root': __dirname});
});

app.listen(8080);
