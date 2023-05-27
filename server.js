

const express = require('express');

let api = require('./api/api');
let dbHelper = require('./dbHelper.js');


const app = express();
const server = require('http').createServer(app);

const io = require('socket.io')(server);

// Real time message listen on database
dbHelper.db.on('trace', (sql) => {
    if (sql.includes('insert into Message')) {
        const pattern = /\("([^"]+)", "([^"]+)", "([^"]+)"\)/g;
        const matches = sql.matchAll(pattern);
        for (const match of matches) {
            let message = {
                issueID: match[2],
                content: match[3],
                userID: match[1],
            };
            io.emit(message.issueID, message);
        }
    }
});


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

server.listen(8080);