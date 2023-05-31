

let express = require('express');
let app = express.Router();

app.post('/', (req, res) => {
    req.logout();
    res.clearCookie('user');
    res.clearCookie('connect.sid');
    res.sendStatus(204);
});

module.exports = app;